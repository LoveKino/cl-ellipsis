# cl-ellipsis

Ellipsis DSL for node, construct something like a1,a2, ..., an

## install

`npm i cl-ellipsis --save`

## usage

### expand number list

Expand a list by writing ellipsis.

- normaly

1, 2, ..., 5 => 1, 2, 3, 4, 5

2, ..., 5 => 2, 3, 4, 5

2, 4, ..., 7 => 2, 4, 6, 7

- only consider at most two elements before ellipsis

-10, 1, 2, ..., 5 => -10, 1, 2, 3, 4, 5

-10, 2, 4, ..., 7 => -10, 2, 4, 6, 7

- code example

```js
let pattern = require('cl-ellipsis');
let ellipsis = pattern.ellipsis;
let expand = pattern.expand;

let t1 = expand([1, 2, 3, ellipsis, 9]); 
console.log(t1);// [1, 2, 3, 4, 5, 6, 7, 8, 9]

let t2 = expand([1, 4, 2, ellipsis, -3]);
console.log(t2);// [1, 4, 2, 0, -2, -3]
```

- you can use more than one ellipsises

You can use more than one ellipsises in one array, the ellipsises will be reduced one by one.

4, 6, ..., 9, ..., 12 => 4, 6, 8, 9, ..., 12 => 4, 6, 8, 9, 10, 11, 12

code example

```js
let pattern = require('cl-ellipsis');
let ellipsis = pattern.ellipsis;
let expand = pattern.expand;

let t1 = expand([4, 6, ellipsis, 9, ellipsis, 12]); 
console.log(t1);// [4, 6, 8, 9, 10, 11, 12]
```

- you can just use string instead of array

```js
let pattern = require('cl-ellipsis');
let ellipsis = pattern.ellipsis;

let ret = expand('1 2 ... 6');
console.log(ret); // [1, 2, 3, 4, 5, 6]
```

### expand array

It's almost the same with number list, but point out which array. See the code:

```js
let pattern = require('cl-ellipsis');
let ellipsis = pattern.ellipsis;
let expand = pattern.expand;

let A = [3, 5, 2, 9, 0, 20, 38, -1, -20];
let ret = expand([-1, tagList([2, 4, ellipsis, 7], A), 9]);
console.log(ret); // [-1, 2, 0, 38, -1, 9]
```

### reduce

- example

```js
let pattern = require('cl-ellipsis');

let E = pattern.E;
let ellipsis = pattern.ellipsis;

let add = (a, b) => a + b;

let ret = E(add, [1, 2, 4, ellipsis, 9]);
console.log(ret); // 30
```

In the code, E(add, [1, 2, 4, ellipsis, 9]) means 1 + 2 + 4 + ... + 9

E(add, [1, 2, 4, ellipsis, 9]), first, expand [1, 2, 4, ellipsis, 9], then use add operation on the list.
