'use strict';

let assert = require('assert');
let jsoneq = require('cl-jsoneq');
let pattern = require('../index');
let expand = pattern.expand;
let ellipsis = pattern.ellipsis;
let tagList = pattern.tagList;

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

    it('array', () => {
        let A = [3, 5, 2, 9, 0, 20, 38, -1, -20];
        let ret = expand([-1, tagList([2, 4, ellipsis, 7], A), 9]);
        assert.equal(jsoneq(ret, [-1, 2, 0, 38, -1, 9]), true);
    });
});
