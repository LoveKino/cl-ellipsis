'use strict';

const ellipsis = require('./const').ellipsis;
/**
 * '1 2 3 ... 6' => [1, 2, 3, 4, 5, 6]
 */
let parse = (str) => {
    let arr = str.split(' ');
    let list = [];
    for (let i = 0; i < arr.length; i++) {
        let word = arr[i];
        word = word.trim();
        if (word !== '') {
            if (word === '...') {
                list.push(ellipsis);
            } else {
                list.push(Number(word));
            }
        }
    }
    return list;
};

module.exports = {
    parse
};
