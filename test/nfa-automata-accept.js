"use strict";

var nfa = require("../nfa");

var automaton = nfa.create({
    start: "START",
    finals: ["SB"],
    states: {
        START: [
            {on: "a", to: "SA"}
        ],
        SA: [
            {on: "a", to: "SA"},
            {on: "b", to: "SA"},
            {on: "b", to: "SB"}
        ],
        SB: []
    }
});

function accept(s) {
    return automaton.accept(s);
}

function callAccept(s) {
    return function () {
        return accept(s);
    };
}

module.exports = {
    testNonStringInput: function (test) {
        test.throws(callAccept(null));
        test.throws(callAccept(undefined));
        test.throws(callAccept({}));
        test.throws(callAccept([]));
        test.throws(callAccept(function () {}));
        test.done();
    },

    testDefinitionRespected: function (test) {
        test.equal(accept("ab"), true);
        test.equal(accept("aba"), false);
        test.equal(accept("abc"), false);
        test.equal(accept("abab"), true);
        test.done();
    }
};