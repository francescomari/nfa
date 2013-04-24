
"use strict";

var nfa = require("../nfa");

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

function accept(s) {
    return automaton.accept(s);
}

module.exports = {
    testAccept: function (test) {
        test.equal(accept(""), false);
        test.equal(accept("ac"), true);
        test.equal(accept("abc"), true);
        test.equal(accept("abbc"), true);
        test.done();
    }
};