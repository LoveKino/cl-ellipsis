'use strict';

/**
 * meta expression
 *
 * mock some expression and translate to ast
 *
 * array get element expression
 *
 * A[0] => A._(0) -> { index, array, type }
 *
 * function run expression
 *
 * f(0) => f._(0) -> { args, fun }
 */

module.exports = () => {
    Array.prototype._ = () => {};
    Function.prototype._ = () => {};
};
