/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var MVVM = __webpack_require__(1);

	var vm = new MVVM({
	  data: {
	    name: 'xiao ming'
	  }
	});

	vm.name = 'da ming';

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Compile = __webpack_require__(2);
	var observe = __webpack_require__(5);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Watcher = __webpack_require__(3);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Dep = __webpack_require__(4);

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

/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// more details see https://segmentfault.com/a/1190000006599500

	var Dep = __webpack_require__(4);

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
	      dep.notify(); // 通知所有订阅者
	    }
	  })
	}

	module.exports = observe;

/***/ }
/******/ ]);