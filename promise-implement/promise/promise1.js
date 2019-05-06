'use strict';

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function isFunction (func) {
  return typeof func === 'function';
}
function isObject(obj) {
  return typeof obj === 'object';
}

function resolve (promise, x) {
  // 2.3.1 promise 和 x 引用了同个对象
  if (promise === x) {
    doReject(promise, new TypeError('Cannot resolve promise with itself'));
  }
  // 2.3.2 x 是 promise
  if (x instanceof this.constructor) {
    if (x.state === PENDING) {
      promise.state = PENDING;
      return this;
    }
    doResolve(promise, x.value);
  }
  // 2.3.3 x 是一个对象或函数
  if (x && isObject(x) || isFunction(x)) {
    // 2.3.3.1
    let then = x.then;
    // 2.3.3.2
    try {
      // 2.3.3.3
      if (isFunction(then)) {
        safelyResolveThen(promise, then);
        return this;
      }
      // 2.3.3.4
      doResolve(promise, x);

    } catch (e) {
      doReject(promise, e);
    }
  }
}

function safelyResolveThen(promise, then) {
  try {
    then(function (value) {
      doResolve(promise, value);
    }, function (reason) {
      doReject(promise, reason);
    })
  } catch (e) {
    doReject(promise, e);
  }
}

function doResolve (promise, value)  {
  promise.state = FULFILLED;
  promise.value = value;

  if (isFunction(promise.onFulfilled)) {
    // 2.2.4
    setTimeout(() => {
      const returnValue = promise.onFulfilled(promise.value);
      if (returnValue) {
        // resolve(promise, returnValue);
      }
    }, 0)
  }

  return promise;
}
function doReject (promise, reason) {
  promise.state = REJECTED;
  promise.value = reason;
  if (isFunction(promise.onRejected)) {
    promise.onRejected(promise.value);
  }

  return promise;
}

function Promise (resolver) {
  this.state = PENDING;
  // 值或原因
  this.value = void 0;
  safelyResolveThen(this, resolver);
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  if (isFunction(onFulfilled) || isFunction(onRejected)) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  }
  return this;
};

module.exports = Promise;