'use strict';

let assert = require('assert');
let jsoneq = require('cl-jsoneq');
let exp = require('../src/expand');
let expand = exp.expand;
let ellipsis = exp.ellipsis;

describe('expand', () => {
    it('simple', () => {
        let ret = expand([1, 2, 3, ellipsis, 9]);
        assert.equal(jsoneq(ret, [1, 2, 3, 4, 5, 6, 7, 8, 9]), true);
    });

    it('down', () => {
        let ret = expand([1, 4, 2, ellipsis, -3]);
        assert.equal(jsoneq(ret, [1, 4, 2, 0, -2, -3]), true);
    });

    it('def step', () => {
        let ret = expand([2, ellipsis, 6]);
        assert.equal(jsoneq(ret, [2, 3, 4, 5, 6]), true);
    });

    it('multi', () => {
        let ret = expand([-1, 2, ellipsis, 6, ellipsis, 9]);
        assert.equal(jsoneq(ret, [-1, 2, 5, 6, 7, 8, 9]), true);
    });
});
