// more details see https://segmentfault.com/a/1190000006599500

var Dep = require('./Dep');

function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }

  // 取出所有属性遍历
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}

function defineReactive(data, key, value) {
  var dep = new Dep();
  // 监听子属性
  observe(value);
  Object.defineProperty(data, key, {
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
    get: function () {
      // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher，添加完移除
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set: function (newValue) {
      if (value === newValue) return;
      console.log('监听到值的变化了 ', value, ' ---> ', newValue);
      value = newValue;
      dep.notify(); // 通知所有订阅者更新视图
    }
  })
}

module.exports = observe;