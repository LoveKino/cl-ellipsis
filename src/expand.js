'use strict';

/**
 * expand example
 * 1, 2, 4, 6, ..., 12, 13, 15, 16, ..., 20
 * =>
 * 1, 2, 4, 6, 8, 10, 12, 13, 15, 16, 17, 18, 19, 20
 *
 * reduce one by one
 */

const ellipsis = {
    __type: 'ellipsis'
};

let expand = (list) => {
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
        if (list[i] !== ellipsis) {
            ret.push(list[i]);
            lastEllipsis = false;
        } else {
            if (lastEllipsis) {
                continue;
            } else {
                ret.push(list[i]);
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
    let eps = range(start, end, step);
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
        [1, 5, 0],
        [1, 5]
    ],
    [
        [1, 6, 2],
        [1, 3, 5, 6]
    ],
    [
        [6, 1, -2],
        [6, 4, 2, 1]
    ],
]
*/

let range = (start, end, step) => {
    let ret = [];
    if (step === 0) {
        ret = [start, end];
    } else if (step > 0) {
        for (var i = start; i <= end; i += step) {
            ret.push(i);
        }
        if (i - step < end) {
            ret.push(end);
        }
    } else {
        for (var j = start; j >= end; j += step) {
            ret.push(j);
        }
        if (j - step > end) {
            ret.push(end);
        }
    }
    return ret;
};

module.exports = {
    expand,
    ellipsis
};
