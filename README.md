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

## Create the NFA

The NFA is created by invoking the `create()` method of the `nfa` module. This method requires the definition of the NFA specified as a JavaScript object.

```javascript
var automaton = require("nfa").create(definition);
```
Creating a NFA with a non-valid definition will throw an `Error` with a hopefully meaningful error message.

## Use the NFA

A NFA can only recognize if a string of characters is valid based on the definition it was built with. To recognize a string of characters use the `accept()` method.

```javascript
automaton.accept("");        // -> false, the empty string is not recognized
automaton.accept("ab");      // -> true, the middle sequence of "a" and "b" can be empty
automaton.accept("abc");     // -> false, "c" not recognized
automaton.accept("aba");     // -> false, "SA" is not a final state
automaton.accept("abab");    // -> true
```

The NFA will throw an error if anything but a string is passed to the `accept()` method.```

## Empty transitions

A feature of an NFA is the recognition of *empty transitions*. You can think of empty transitions as moving between states if nothing happens. This concept is very similar to the `*` operator in regular expressions. The regular expression `ab*c` can match an `a`, *zero or more* `b` and a `c`. You can write a NFA for this regular expression by mapping the transition from `a` to `c` as an empty transition, because if no `b` are in the input you can directly jump and recognize `c`.

The NFA definition supports empty transitions. They are represented with an empty string (`""`) in the `to` field of a transition object.

The following example is the definition for the NFA recognizing the language represented by the regular expression `ab*c`. Please note that this example is not the most efficient automaton to recognize the language represented by this regular expression (in fact, a DFA would suffice), it is only provided for illustration purpose.

```javascript
var automaton = nfa.create({
    start: "START",
    finals: ["S3"],
    states: {
        START: [
            {on: "a", to: "S1"}
        ],
        S1: [
            {on: "", to: "S2"},
            {on: "", to: "S4"}
        ],
        S2: [
            {on: "c", to: "S3"}
        ],
        S3: [
        ],
        S4: [
            {on: "b", to: "S5"}
        ],
        S5: [
            {on: "b", to: "S5"},
            {on: "c", to: "S3"}
        ]
    }
});

automaton.accept("");       // -> false, the empty string is not recognized
automaton.accept("ac");     // -> true
automaton.accept("abc");    // -> true
automaton.accept("abbc");   // -> true
```