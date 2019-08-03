const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function doResolve (promise, value) {
  promise.state = FULFILLED;
  promise.value = value;

  console.log('doResolve', promise.onFulfilled)
  if (isFunction(promise.onFulfilled)) {
    // 2.2.4
    // 需要确保onFulfilled和onRejected的异步执行，
    // 是在调用then的事件轮训时间片之后，且调用栈为空。
    // 更多详情可看http://one-pieces.me/2018/11/14/24-Promises-A-%E8%A7%84%E8%8C%83/#3-%E6%B3%A8%E9%87%8A
    setTimeout(() => {
      console.log('doResolve setTimeout')
      promise.onFulfilled(promise.value);
    }, 0);
  }
  return promise;
}
function doReject (promise, reason) {
  promise.state = REJECTED;
  promise.value = reason;
  if (isFunction(promise.onRejected)) {
    setTimeout(() => {
      promise.onRejected(promise.value);
    }, 0);
  }

  return promise;
}

function safelyResolveThen(promise, then) {
  try {
    then(function (value) {
      console.log('safelyResolveThen doResolve')
      doResolve(promise, value);
    }, function (reason) {
      doReject(promise, reason);
    })
  } catch (e) {
    doReject(promise, e);
  }
}

// 然后修改 Promise 构造函数
function Promise (resolver) {
  this.state = PENDING;
  // 值或原因
  this.value = void 0;
  safelyResolveThen(this, resolver);
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  // 2.2.1
  console.log('then')

  if (isFunction(onFulfilled) || isFunction(onRejected)) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  }
  // 根据2.2.7，
  // then必须返回一个 promise，但它还有其他的规则，
  // 这里我们先不管，直接返回当前 promise
  return this;
};

function isFunction (func) {
  return typeof func === 'function';
}
function isObject(obj) {
  return typeof obj === 'object';
}

const promise = new Promise((resolve, reject) => {
  console.log('111')
  setTimeout(() => {
    console.log('Promise setTimeout')
    resolve('222')
  })
  console.log('333')
})

promise.then((res) => {
  console.log(res)
  return '444'
}, (reason) => {
  console.log(reason)
})
