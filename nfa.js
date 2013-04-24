"use strict";

function forEachFinal(definition, f) {
    var i, result;

    for (i = 0; i < definition.finals.length; i += 1) {
        result = f(definition.finals[i]);

        if (result) {
            return result;
        }
    }
}

function forEachState(definition, f) {
    var state, result;

    for (state in definition.states) {
        if (definition.states.hasOwnProperty(state)) {
            result = f(state, definition.states[state]);

            if (result) {
                return result;
            }
        }
    }
}

function forEachTransition(definition, f) {
    return forEachState(definition, function (name, transitions) {
        var i, result;

        for (i = 0; i < transitions.length; i += 1) {
            result = f(name, transitions[i], i);

            if (result) {
                return result;
            }
        }
    });
}

function forEachStateTransition(definition, state, f) {
    var i, result;

    for (i = 0; i < definition.states[state].length; i += 1) {
        result = f(definition.states[state][i]);

        if (result) {
            return result;
        }
    }
}

function validate(definition) {
    var error;

    function isStateUndefined(name) {
        return definition.states.hasOwnProperty(name) === false;
    }

    // Definition is mandatory

    if (!definition) {
        return "Invalid definition";
    }

    // Start state is mandatory

    if (!definition.start) {
        return "Start state not specified";
    }

    // Final states are mandatory

    if (!definition.finals) {
        return "Final states not specified";
    }

    // At least one final state must be specified

    if (definition.finals.length === 0) {
        return "No final states listed";
    }

    // Definition of states must be specified

    if (!definition.states) {
        return "No states specified";
    }

    // Definition of start state must be specified

    if (isStateUndefined(definition.start)) {
        return "The initial state has no definition";
    }

    // Definition of every final state must be specified

    error = forEachFinal(definition, function (f) {
        if (isStateUndefined(f)) {
            return "Final state '" + f + "' has no definition";
        }
    });

    if (error) {
        return error;
    }

    // Each state must process one character at a time and the destination must have a 
    // definition

    error = forEachTransition(definition, function (state, transition, index) {
        if (!transition) {
            return "Invalid transition " + index + " for state '" + state + "'";
        }

        if (!transition.on) {
            return "No character specified for transition " + index + " in state '" + state + "'";
        }

        if (transition.on.length > 1) {
            return "Invalid character for transition " + index + " in state '" + state + "'";
        }

        if (!transition.to) {
            return "No destination specified for transition " + index + " in state '" + state + "'";
        }

        if (isStateUndefined(transition.to)) {
            return "Invalid destination '" + transition.to + "' for transition " + index + " in state '" + state + "'";
        }
    });

    if (error) {
        return error;
    }
}

// Set implementation for primitive values

function set() {
    var data = {};

    return {
        add: function (e) {
            data[e] = true;
        },

        addSet: function (s) {
            s.each(function (e) {
                data[e] = true;
            });
        },

        each: function (f) {
            var keys = Object.keys(data);
            keys.forEach.call(keys, f, this);
        },

        all: function () {
            return Object.keys(data);
        },

        empty: function () {
            return Object.keys(data).length === 0;
        },

        has: function (e) {
            return data.hasOwnProperty(e);
        },

        hasAny: function (a) {
            return a.some(function (e) {
                return data.hasOwnProperty(e);
            });
        }
    };
}

// Automata factory function

exports.create = function (definition) {
    var error;

    // Set of states reachable from state and input character c

    function destinations(c, state) {
        var result = set();

        forEachStateTransition(definition, state, function (transition) {
            if (transition.on === c) {
                result.add(transition.to);
            }
        });

        return result;
    }

    // Set of destinations reachable from a direct or indirect empty transition, starting from each state in "states"

    function empty(states) {
        var result = set(), queue = [];

        function maybeAddDestination(destination) {
            if (result.has(destination) === false) {
                result.add(destination);
                queue.push(destination);
            }
        }

        result.addSet(states);
        queue.push.apply(queue, states.all());

        while (queue.length > 0) {
            destinations("", queue.pop()).each(maybeAddDestination);
        }

        return result;
    }

    // Set of destinations reachable from a direct transition with character "c", starting from each state in "states"

    function move(c, states) {
        var result = set();

        states.each(function (state) {
            result.addSet(destinations(c, state));
        });

        return result;
    }

    error = validate(definition);

    if (error) {
        throw new Error(error);
    }

    return {
        accept: function (s) {
            var start, current, i;

            if (typeof s !== "string") {
                throw new Error("Input is not a string");
            }

            start = set();
            start.add(definition.start);

            current = empty(start);

            for (i = 0; i < s.length && current.empty() === false; i += 1) {
                current = empty(move(s[i], current));
            }

            return current.hasAny(definition.finals);
        }
    };
};
