'use strict';

let assert = require('assert');
let pattern = require('../index');

let E = pattern.E;
let ellipsis = pattern.ellipsis;

describe('pattern', () => {
    it('simple', () => {
        let ret = E((a, b) => a + b, [1, 2, 4, ellipsis, 9]);
        assert.equal(ret, 1 + 2 + 4 + 6 + 8 + 9);
    });

    it('down', () => {
        let ret = E((a, b) => a + b, [11, 10, 6, ellipsis, -1]);
        assert.equal(ret, 11 + 10 + 6 + 2 - 1);
    });

    it('no ellipsis', () => {
        let ret = E((a, b) => a + b, [3, 2, 9]);
        assert.equal(ret, 3 + 2 + 9);
    });

    it('type:op', (done) => {
        try {
            E(null);
        } catch (err) {
            if (err.toString().indexOf('need function') !== -1) {
                done();
            } else {
                done(err);
            }
        }
    });

    it('type:args', (done) => {
        try {
            E(() => {}, 10);
        } catch (err) {
            if (err.toString().indexOf('need array') !== -1) {
                done();
            } else {
                done(err);
            }
        }
    });

    it('type:args', () => {
        let ret = E(() => {}, []);
        assert.equal(ret, null);
    });
});
