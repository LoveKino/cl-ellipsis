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
            ret.push(item);
            if(lastEllipsis && typeof item !== 'number') {
                throw new Error('the one after ellipsis must be number');
            }
            lastEllipsis = false;
        } else {
            if (lastEllipsis) {
                continue;
            } else {
                // check prev item
                let prev = list[i - 1];
                if(typeof prev !== 'number') {
                    throw new Error('the one before ellipsis must be number');
                }
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
            prev: [1],
            expandedEllipsis: [2, 3, 4, 5],
            next: []
        }
    ],
    [
        [
            [2, 4, '...', 9, 10], 2
        ],
        {
            prev: [2],
            expandedEllipsis: [4, 6, 8, 9],
            next: [10]
        }
    ],
    [
        [
            [0, '...', 0], 1
        ],
        {
            prev: [],
            expandedEllipsis: [0],
            next: []
        }
    ]
]
*/
let expandEllip = (list, ellipsisIndex) => {
    let step = getStep(list, ellipsisIndex);
    let start = list[ellipsisIndex - 1];
    let end = list[ellipsisIndex + 1];
    let eps = section(start, end, step);
    let prev = list.slice(0, ellipsisIndex - 1);
    let expandedEllipsis = eps;
    let next = list.slice(ellipsisIndex + 2);
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
    ],
    [
        [
            [0, '...', 0], 1
        ], 0
    ]
]
*/
let getStep = (list, ellipsisIndex) => {
    let prev = list[ellipsisIndex - 1];
    let next = list[ellipsisIndex + 1];

    let prevD = list[ellipsisIndex - 2];
    if (ellipsisIndex > 1 && typeof prevD === 'number') {
        return prev - prevD;
    } else {
        if (prev < next) {
            return 1;
        } else if (prev === next) {
            return 0;
        } else {
            return -1;
        }
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
