var quickSort = require('./index');

var arr = [4,6,3,2,1,7,9,8,5];

console.log(arr);

quickSort(arr, arr.length, 0, arr.length - 1);

console.log(arr);