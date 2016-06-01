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

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

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

  function compile (vm) {
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
      //console.log(vm.data)
    }
  }

  /**
   * Created by zhangran on 16/6/1.
   */

  /**
   * 封装data => class, 添加属性读取器
   * @param vm
   */

  function data (vm) {
    var data = vm._data;

    var Data = function Data() {
      babelHelpers.classCallCheck(this, Data);
    };

    var _loop = function _loop(item) {
      var DataNoop = function (_Data) {
        babelHelpers.inherits(DataNoop, _Data);

        function DataNoop() {
          babelHelpers.classCallCheck(this, DataNoop);

          var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(DataNoop).call(this));

          _this[item] = data[item];
          return _this;
        }

        babelHelpers.createClass(DataNoop, [{
          key: item,
          get: function get() {
            return this['_' + item];
          },
          set: function set(value) {
            this['_' + item] = value;
          }
        }]);
        return DataNoop;
      }(Data);

      Data = DataNoop;
    };

    for (var item in data) {
      _loop(item);
    }

    var result = new Data();
    console.log(result.message);

    //vm.data = new Data();
  }

  var MY = function () {
    function MY(options) {
      babelHelpers.classCallCheck(this, MY);

      this._$el = document.querySelector(options.el);
      this._data = options.data;

      compile(this);
      data(this);
    }

    babelHelpers.createClass(MY, [{
      key: '$el',
      get: function get() {
        return this._$el;
      }
    }]);
    return MY;
  }();

  return MY;

}));