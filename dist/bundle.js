(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.MY = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  /**
   * Created by zhangran on 16/6/1.
   */

  /**
   * 转换类数组对象为数组
   * @param arrryLike
   * @returns {Array.<*>}
   */

  function slice(arrryLike) {
    return [].slice.call(arrryLike);
  }

  /**
   * Created by zhangran on 16/6/1.
   */

  /**
   *
   * @type {string}
   */

  var interpolationBegin = '{{';
  var interpolationEnd = '}}';

  var interpolationReg = new RegExp(interpolationBegin + '((?:.|\\n)+?)' + interpolationEnd, 'img');

  /**
   * 编译dom
   * @param vm
   */

  function _compile (vm) {
    var $el = vm.$el;

    var childNodes = $el.childNodes;
    var childAry = slice(childNodes);

    childAry.forEach(function (child) {
      distribution(child, vm);
    });
  }

  /**
   * 分发节点编译
   * @param node
   * @param vm
   */

  function distribution(node, vm) {
    var nodeType = node.nodeType;

    switch (nodeType) {
      case 1:
        break;
      case 3:
        parseTextNode(node, vm);
        break;
    }
  }

  /**
   * 编译text文本节点
   * @param node text dom 节点
   * @param vm vm实例
   */

  function parseTextNode(node, vm) {
    var nodeValue = node.nodeValue;

    var execResult = void 0;

    while (execResult = interpolationReg.exec(nodeValue)) {
      console.log(vm.data);
    }
  }

  var MY = function () {
    function MY(options) {
      babelHelpers.classCallCheck(this, MY);

      this._$el = document.querySelector(options.el);
      this._data = options.data;

      this.compile();
    }

    babelHelpers.createClass(MY, [{
      key: 'compile',
      value: function compile() {
        _compile(this);
      }
    }, {
      key: '$el',
      get: function get() {
        return this._$el;
      }
    }, {
      key: 'data',
      get: function get() {
        return this._data;
      }
    }, {
      key: 'sex',
      set: function set(sex) {
        console.log(sex);
      }
    }]);
    return MY;
  }();

  return MY;

}));