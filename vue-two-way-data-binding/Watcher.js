var Dep = require('./Dep');

function Watcher(vm, exp, cb) {
  this.cb = cb;
  this.vm = vm;
  this.exp = exp;
  // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
  this.value = this.get();
}

Watcher.prototype.update = function () {
  // 属性值变化收到通知
  this.run();
};

Watcher.prototype.run = function () {
  var value = this.get(); // 取到最新值
  var oldValue = this.value;
  if (value !== oldValue) {
    this.value = value;
    this.cb.call(this.vm, value, oldValue); // 执行Compile中绑定的回调，更新视图
  }
};

Watcher.prototype.get = function () {
  Dep.target = this; // 将当前订阅者指向自己
  var value = this.vm[this.exp]; // 触发getter，这时会执行Observer的get逻辑，添加自己到属性订阅器中
  Dep.target = null; // 添加完毕，重置
  return value;
};

module.exports = Watcher;