var Watcher = require('./Watcher');

function Compile(el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);
  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el);
    this.init();
    this.$el.appendChild(this.$fragment);
  }
}

Compile.prototype.init = function () {
  this.compileElement(this.$fragment);
};

Compile.prototype.node2Fragment = function (el) {
  var fragment = document.createDocumentFragment(), child;
  // 将原生节点拷贝到fragment
  // （使用fragment是因为fragment存在于内存中，并不在DOM树，所以将子元素插入到fragment时不会引起页面回流（reflow）。
  // 因此，使用fragment通常会起到优化性能的作用），详见https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment
  while (child = el.firstChild) {
    fragment.appendChild(child);
  }
  return fragment;
};

Compile.prototype.compileElement = function (el) {
  var childNodes = el.childNodes, me = this;
  [].slice.call(childNodes).forEach(function (node) {
    var text = node.textContent;
    var reg = /\{\{(.*)\}\}/; // 表达式文本
    // 按元素节点方式编译
    if (me.isElementNode(node)) {
      me.compile(node);
    } else if (me.isTextNode(node) && reg.test(text)) {
      me.compileText(node, RegExp.$1);
    }
    // 遍历编译子节点
    if (node.childNodes && node.childNodes.length) {
      me.compileElement(node);
    }
  });
};

Compile.prototype.compile = function (node) {
  var nodeAttrs = node.attributes, me = this;
  [].slice.call(nodeAttrs).forEach(function (attr) {
    // 规定：指令以 v-xxx 命名
    // 如 <span v-text="content"></span> 中指令为 v-text
    var attrName = attr.name; // v-text
    if (me.isDirective(attrName)) {
      var exp = attr.value; // content
      var dir = attrName.substring(2); // text
      if (me.isEventDirective(dir)) {
        // 事件指令，如 v-on:click
        compileUtil.eventHandler(node, me.$vm, exp, dir);
      } else {
        // 普通指令
        compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
      }
    }
  });
};

Compile.prototype.compileText = function (node, exp) {
  compileUtil.text(node, this.$vm, exp);
};

Compile.prototype.isDirective = function(attr) {
  return attr.indexOf('v-') == 0;
};

Compile.prototype.isEventDirective = function (dir) {
  return dir.indexOf('on') === 0;
};

Compile.prototype.isElementNode = function (node) {
  return node.nodeType == 1;
};

Compile.prototype.isTextNode = function (node) {
  return node.nodeType == 3;
};

// 指令处理集合
var compileUtil = {
  text: function(node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  bind: function (node, vm, exp, dir) {
    var updateFn = updater[dir + 'Updater'];
    // 第一次初始化视图
    updateFn && updateFn(node, vm[exp]);
    // 实例化订阅者，此操作会在对应的属性消息订阅器中添加该订阅者watcher
    new Watcher(vm, exp, function(value, oldValue) {
      // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
      updateFn && updateFn(node, value, oldValue);
    });
  },
  eventHandler: function(node, vm, exp, dir) {
    console.log('eventHandler', node, vm, exp, dir);
    // TODO
  }
};

// 更新函数
var updater = {
  textUpdater: function(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  }
};

module.exports = Compile;
