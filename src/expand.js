'use strict';

let expandNumberList = require('./expandNumberList');
let constaints = require('./const');
let parser = require('./parser');

let tagedList = constaints.tagedList;
let tagedNumbers = constaints.tagedNumbers;
let parse = parser.parse;

let expand = (list) => {
    if(typeof list === 'string') {
        list = parse(list);
    }
    let fragments = divide(list);
    let rets = [];
    for (let i = 0; i < fragments.length; i++) {
        let frag = fragments[i];
        if (isTagedListObject(frag)) {
            rets = rets.concat(expandArray(frag.indexList, frag.list));
        } else if (isTagedNumbersObject(frag)) {
            rets = rets.concat(expandNumberList(frag.numbers));
        }
    }
    return rets;
};

let divide = (list) => {
    let ret = [];
    let numbers = [];
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (isTagedListObject(item)) {
            ret.push({
                numbers,
                type: tagedNumbers
            });
            ret.push(item);
            numbers = [];
        } else {
            numbers.push(item);
        }
    }
    if (numbers.length) {
        ret.push({
            numbers,
            type: tagedNumbers
        });
    }
    return ret;
};

let expandArray = (indexList, list) => {
    let ret = [];
    let indexes = expandNumberList(indexList);
    for (let i = 0; i < indexes.length; i++) {
        let index = indexes[i];
        ret.push(list[index]);
    }
    return ret;
};

let tagList = (indexList, list) => {
    return {
        indexList,
        list,
        type: tagedList
    };
};

let isTagedListObject = (v) => v && typeof v === 'object' && v.type === tagedList;

let isTagedNumbersObject = (v) => v && typeof v === 'object' && v.type === tagedNumbers;

module.exports = {
    expand,
    tagList
};
