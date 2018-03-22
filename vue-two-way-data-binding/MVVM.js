var Compile = require('./Compile');
var observe = require('./observe');

function MVVM(options) {
  this.$options = options;
  var data = this._data = this.$options.data, me = this;
  // 属性代理，实现 vm.xxx -> vm._data.xxx
  Object.keys(data).forEach(function (key) {
    me._proxy(key);
  });
  observe(data, this);
  this.$compile = new Compile(options.el || document && document.body, this);
}

MVVM.prototype._proxy = function (key) {
  var me = this;
  Object.defineProperty(me, key, {
    enumerable: true,
    configurable: false,
    get: function proxyGetter() {
      return me._data[key];
    },
    set: function (newValue) {
      me._data[key] = newValue;
    }
  });
};

module.exports = MVVM;
