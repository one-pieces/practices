function Dep() {
  this.subs = [];
}

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
};

Dep.prototype.notify = function () {
  this.subs.forEach(function (sub) {
    sub.update(); // 调用订阅者的update方法，通知变化
  });
};

module.exports = Dep;
