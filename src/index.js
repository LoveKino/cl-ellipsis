'use strict';

let exp = require('./expand');
let ellipsis = require('./const').ellipsis;

let expand = exp.expand;
let tagList = exp.tagList;

let E = (op, args) => {
    if (!isFunction(op)) throw new TypeError('need function as first argument');

    if (!isArray(args)) throw new TypeError('need array as second argument');

    if (!args.length) return null;

    let list = expand(args);

    return opList(op, list);
};

/**
 *
 * ## test
[
    [
        [(a, b) => a + b, [1, 2, 3]], 6
    ],
    [
        [(a, b) => a - b, [10, 2, 3]], 5
    ]
]
*/
let opList = (op, list) => {
    let result = list[0];
    for (let i = 1; i < list.length; i++) {
        result = op(result, list[i]);
    }
    return result;
};

let isFunction = v => typeof v === 'function';

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

module.exports = {
    E,
    ellipsis,
    expand,
    tagList
};
