"use strict";

function validate(definition) {
    var error;

    function forEachFinal(f) {
        var i, result;

        for (i = 0; i < definition.finals.length; i += 1) {
            result = f(definition.finals[i]);

            if (result) {
                return result;
            }
        }
    }

    function forEachState(f) {
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

    function forEachTransition(f) {
        return forEachState(function (name, transitions) {
            var i, result;

            for (i = 0; i < transitions.length; i += 1) {
                result = f(name, transitions[i], i);

                if (result) {
                    return result;
                }
            }
        });
    }

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

    error = forEachFinal(function (f) {
        if (isStateUndefined(f)) {
            return "Final state '" + f + "' has no definition";
        }
    });

    if (error) {
        return error;
    }

    // Each state must process one character at a time and the destination must have a 
    // definition

    error = forEachTransition(function (state, transition, index) {
        if (!transition) {
            return "Invalid transition " + index + " for state '" + state + "'";
        }

        if (!transition.on) {
            return "No character specified for transition " + index + " in state '" + state + "'";
        }

        if (transition.on.length !== 1) {
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

exports.create = function (definition) {
    var error;

    error = validate(definition);

    if (error) {
        throw new Error(error);
    }

    return {};
};
