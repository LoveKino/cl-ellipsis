'use strict';

let assert = require('assert');
let jsoneq = require('cl-jsoneq');
let pattern = require('../index');
let expand = pattern.expand;
let tagList = pattern.tagList;

describe('expand', () => {
    it('simple', () => {
        let ret = expand([1, 2, 3, '...', 9]);
        assert.equal(jsoneq(ret, [1, 2, 3, 4, 5, 6, 7, 8, 9]), true);
    });

    it('down', () => {
        let ret = expand([1, 4, 2, '...', -3]);
        assert.equal(jsoneq(ret, [1, 4, 2, 0, -2, -3]), true);
    });

    it('def step', () => {
        let ret = expand([2, '...', 6]);
        assert.equal(jsoneq(ret, [2, 3, 4, 5, 6]), true);
    });

    it('multi', () => {
        let ret = expand([-1, 2, '...', 6, '...', 9]);
        assert.equal(jsoneq(ret, [-1, 2, 5, 6, 7, 8, 9]), true);
    });

    it('array', () => {
        let A = [3, 5, 2, 9, 0, 20, 38, -1, -20];
        let ret = expand([-1, tagList([2, 4, '...', 7], A), 9]);
        assert.equal(jsoneq(ret, [-1, 2, 0, 38, -1, 9]), true);
    });

    it('string', () => {
        let ret = expand('1 2 ... 6');
        let ret2 = expand('2 4 ... 8 9 ... 12');
        let ret3 = expand('');
        let ret4 = expand('1 ... 1');
        let ret5 = expand('2 ... 1');
        let ret6 = expand('2 ... ... 1');
        assert.equal(jsoneq(ret, [1, 2, 3, 4, 5, 6]), true);
        assert.equal(jsoneq(ret2, [2, 4, 6, 8, 9, 10, 11, 12]), true);
        assert.equal(jsoneq(ret3, []), true);
        assert.equal(jsoneq(ret4, [1]), true);
        assert.equal(jsoneq(ret5, [2, 1]), true);
        assert.equal(jsoneq(ret6, [2, 1]), true);
    });

    it('mix', () => {
        let ret = expand(['a', 'b', 'c', 2, '...', 4]);
        assert.equal(jsoneq(ret, ['a', 'b', 'c', 2, 3, 4]), true);
    });

    it('error-ellipsis-first', (done) => {
        try {
            expand('... 1 2');
        } catch (err) {
            if (err.toString().indexOf('at first') !== -1)
                done();
            else {
                done(err);
            }
        }
    });

    it('error-ellipsis-last', (done) => {
        try {
            expand('1 2 ...');
        } catch (err) {
            if (err.toString().indexOf('at last') !== -1)
                done();
            else {
                done(err);
            }
        }
    });

    it('error-prev', (done) => {
        try {
            expand(['a', 'b', 'c', '...', 4]);
        } catch (err) {
            if (err.toString().indexOf('the one before ellipsis must be number') !== -1)
                done();
            else {
                done(err);
            }
        }
    });

    it('error-next', (done) => {
        try {
            expand(['a', 'b', 3, '...', null]);
        } catch (err) {
            if (err.toString().indexOf('the one after ellipsis must be number') !== -1)
                done();
            else {
                done(err);
            }
        }
    });
});
