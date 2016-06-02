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
   * 封装data => class, 添加属性读取器
   * @param data
   * @returns {Data} 类 Data
   */

  function initData (data) {
    var Data = function Data() {
      babelHelpers.classCallCheck(this, Data);
    };

    var _loop = function _loop(item) {
      var DataNoop = function (_Data) {
        babelHelpers.inherits(DataNoop, _Data);

        function DataNoop() {
          babelHelpers.classCallCheck(this, DataNoop);

          var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(DataNoop).call(this));

          console.log(item);
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

    return Data;
  }

  /**
   * Created by zhangran on 16/6/2.
   */

  /**
   * 封装 computed => class, 添加计算属性读取器
   * @param computed
   * @returns {Computed}
   */

  function initComputed (computed, MY) {
    var Computed = function (_MY) {
      babelHelpers.inherits(Computed, _MY);

      function Computed() {
        babelHelpers.classCallCheck(this, Computed);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Computed).apply(this, arguments));
      }

      return Computed;
    }(MY);

    var _loop = function _loop(item) {
      var ComputedNoop = function (_Computed) {
        babelHelpers.inherits(ComputedNoop, _Computed);

        function ComputedNoop() {
          babelHelpers.classCallCheck(this, ComputedNoop);

          var _this2 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ComputedNoop).call(this));

          _this2[item] = computed[item].call(_this2);
          return _this2;
        }

        babelHelpers.createClass(ComputedNoop, [{
          key: item,
          get: function get() {
            return this['_' + item];
          },
          set: function set(value) {
            this['_' + item] = value;
          }
        }]);
        return ComputedNoop;
      }(Computed);

      Computed = ComputedNoop;
    };

    for (var item in computed) {
      _loop(item);
    }

    return Computed;
  }

  function index (options) {
    var $el = document.querySelector(options.el);
    var data = options.data;
    var computed = options.computed;


    var DataClass = initData(data);

    var MY = function (_DataClass) {
      babelHelpers.inherits(MY, _DataClass);

      function MY() {
        babelHelpers.classCallCheck(this, MY);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(MY).apply(this, arguments));
      }

      return MY;
    }(DataClass);

    MY = initComputed(computed, MY);

    return new MY();
  }

  return index;

}));