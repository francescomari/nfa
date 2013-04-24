# Nondeterministic Finite Automaton

This is a [Nondeterministic Finite Automaton (NFA)](http://en.wikipedia.org/wiki/Nondeterministic_finite_automata) written in JavaScript.

## Define the NFA

The NFA can be defined by a JavaScript object containing the name of the initial state, the name of the final state and a definition of every state. For each state you must specifiy what happens when a character is recognized by the NFA (i.e. which state the automaton should move to).

Compared to a DFA, an NFA can have more than one edge labeled with the same character. In other words, if an NFA is in a state `A` and the current character in the input is `a`, is perfectly fine to have to destination states for the same input.

The following example is a definition for an NFA which recognizes non-empty strings starting with `a`, ending with `b`, and containing an optional sequence of `a` and `b` in the middle (e.g. `ab`, `aab`, `abb`, `aabb`, `abab`, etc.).

```javascript
var definition = {
    // Specify the initial state
    start: "START",
    // Specify the final state(s)
    finals: ["SB"],
    // Define states
    states: {
        // If we recognize character "a" we jump to state "SA"
        START: [
            {on: "a", to: "SA"}
        ],
        // If we recognize "a" we stay on "SA". On "b" we can stay on "SA" or jump to "SB"
        SA: [
            {on: "a", to: "SA"},
            {on: "b", to: "SA"},
            {on: "b", to: "SB"}
        ],
        // Nothing to do in "SB", but you need to define it
        SB: []
    }
};
```
