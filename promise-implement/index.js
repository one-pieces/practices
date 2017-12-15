'use strict';

var Promise = require('./appoint');
var promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('haha');
  }, 0);
});
promise
  .then((data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data + 'xixi');
      }, 1000);
    });
  })
  .then((data) => { console.log('w', data); })
  .then(() => {})
// var a = promise.then(function onSuccess(data) {
//   console.log('data', data);
// });
// var b = promise.catch(function onError() {
//
// });
// console.dir(promise, { depth: 10 });
// console.log(promise.queue[0].promise === a);
// console.log(promise.queue[1].promise === b);