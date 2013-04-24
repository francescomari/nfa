"use strict";

var nfa = require("../nfa");

function create(definition) {
    return nfa.create(definition);
}

function callCreate(definition) {
    return function () {
        return create(definition);
    };
}

module.exports = {
    setUp: function (done) {
        this.definition = {
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
        };
        done();
    },

    testCorrectDefinition: function (test) {
        test.ok(create(this.definition));
        test.done();
    },

    testMissingDefinition: function (test) {
        test.throws(callCreate(null));
        test.throws(callCreate(undefined));
        test.done();
    },

    testMissingStart: function (test) {
        delete this.definition.start;
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMissingFinals: function (test) {
        delete this.definition.finals;
        test.throws(callCreate(this.definition));
        test.done();
    },

    testEmptyFinals: function (test) {
        this.definition.finals = [];
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMissingStates: function (test) {
        delete this.definition.states;
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMissingStartDefinition: function (test) {
        this.definition.start = "missing";
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMissingFinalDefinition: function (test) {
        this.definition.finals.push("missing");
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMissingTransition: function (test) {
        this.definition.states.START[0] = null;
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMissingChar: function (test) {
        delete this.definition.states.START[0].on;
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMultipleChars: function (test) {
        this.definition.states.START[0].on = "abc";
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMissingDestinationState: function (test) {
        delete this.definition.states.START[0].to;
        test.throws(callCreate(this.definition));
        test.done();
    },

    testMissingDestinationStateDefinition: function (test) {
        this.definition.states.START[0].to = "missing";
        test.throws(callCreate(this.definition));
        test.done();
    }
};
