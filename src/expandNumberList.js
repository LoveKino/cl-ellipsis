'use strict';

/**
 * expand example
 * 1, 2, 4, 6, ..., 12, 13, 15, 16, ..., 20
 * =>
 * 1, 2, 4, 6, 8, 10, 12, 13, 15, 16, 17, 18, 19, 20
 *
 * reduce one by one
 */

const ellipsis =  require('./const').ellipsis;

let expandNumberList = (list) => {
    list = prevProcess(list);

    let index = 0;
    while (index < list.length) {
        if (list[index] === ellipsis) {
            let temp = expandEllip(list, index);
            list = temp.prev.concat(temp.expandedEllipsis).concat(temp.next);
            index = temp.prev.length + temp.expandedEllipsis.length;
        } else {
            index++;
        }
    }

    return list;
};

/**
 *
 * scan list to do that:
 *
 * (1) validate
 *     ellipsis can not be the first or the last one in list
 * (2) merge adjacent ellipsis
 */
let prevProcess = (list) => {
    let ret = [];
    if (list[0] === ellipsis) {
        throw new Error('found ellipsis at first.');
    } else if (list[list.length - 1] === ellipsis) {
        throw new Error('found ellipsis at last.');
    }
    let lastEllipsis = false;
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item !== ellipsis) {
            if(typeof item !== 'number') {
                throw new TypeError('Expect number in expanded list, but got ' + item);
            }
            ret.push(item);
            lastEllipsis = false;
        } else {
            if (lastEllipsis) {
                continue;
            } else {
                ret.push(item);
                lastEllipsis = true;
            }
        }
    }
    return ret;
};

/**
 *
 * ## test
[
    [
        [
            [1, 2, '...', 5], 2
        ],
        {
            prev: [1, 2],
            expandedEllipsis: [3, 4],
            next: [5]
        }
    ],
    [
        [
            [2, 4, '...', 9, 10], 2
        ],
        {
            prev: [2, 4],
            expandedEllipsis: [6, 8],
            next: [9, 10]
        }
    ]
]
*/
let expandEllip = (list, ellipsisIndex) => {
    let step = getStep(list, ellipsisIndex);
    let start = list[ellipsisIndex - 1];
    let end = list[ellipsisIndex + 1];
    let eps = section(start, end, step);
    eps.pop();
    eps.shift();
    let prev = list.slice(0, ellipsisIndex);
    let expandedEllipsis = eps;
    let next = list.slice(ellipsisIndex + 1);
    return {
        prev,
        expandedEllipsis,
        next
    };
};

/**
 *
 * ## test
[
    [
        [
            [2, '...', 4, 5], 1
        ], 1
    ],
    [
        [
            [2, 5, 7, '...', 12, 11], 3
        ], 2
    ]
]
*/
let getStep = (list, ellipsisIndex) => {
    let prev = list[ellipsisIndex - 1];
    let next = list[ellipsisIndex + 1];
    if (ellipsisIndex === 1) {
        if (prev < next) {
            return 1;
        } else if (prev === next) {
            return 0;
        } else {
            return -1;
        }
    } else {
        let prevD = list[ellipsisIndex - 2];
        return prev - prevD;
    }
};

/**
 *
 * ## test
[
    [
        [1, 6, 2],
        [1, 3, 5, 6]
    ],
    [
        [6, 1, -2],
        [6, 4, 2, 1]
    ],
    [
        [6, 4],
        [6, 5, 4]
    ],
    [
        [4, 6],
        [4, 5, 6]
    ],
    [
        [0, 0],
        [0]
    ],
    [
        [4, 2, 1],
        [4, 2]
    ],
    [
        [1, 5, 0],
        [1, 5]
    ],
    [
        [2, 4, -1],
        [2, 4]
    ]
]
*/

let section = (start, end, step) => {
    let defStep = 1;
    if (end < start) defStep = -1;
    else if (end === start) defStep = 0;
    if (step === undefined) step = defStep;
    let ret = [start];
    if (step > 0) {
        for (var i = start + step; i < end; i += step) {
            ret.push(i);
        }
    } else {
        for (var j = start + step; j > end; j += step) {
            ret.push(j);
        }
    }

    start !== end && ret.push(end);
    return ret;
};


module.exports = expandNumberList;
