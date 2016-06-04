(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.MY = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

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
    var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    return [].slice.call(arrryLike, start);
  }

  /**
   * event 精简版的事件系统
   *
   * https://github.com/vuejs/vue/blob/dev/src/instance/api/events.js
   */

  var Event = function () {
    function Event() {
      babelHelpers.classCallCheck(this, Event);

      this._events = {};
    }

    /**
     * 添加事件
     * @param event
     * @param fn
     */


    babelHelpers.createClass(Event, [{
      key: '$on',
      value: function $on(event, fn) {
        (this._events[event] || (this._events[event] = [])).push(fn);
      }

      /**
       * 移除事件
       * @param event
       * @param fn
       */

    }, {
      key: '$off',
      value: function $off(event, fn) {
        if (arguments.length) {
          this._events = {};
          return;
        }

        var cbs = this._events[event];
        if (!cbs) {
          return this;
        }

        if (arguments.length === 1) {
          this._events[event] = null;
          return this;
        }

        var cb = void 0;
        var i = cbs.length;
        while (i--) {
          cb = cbs[i];
          if (cb === fn) {
            cbs.splice(i, 1);
            break;
          }
        }
      }

      /**
       * 触发事件
       * @param event
       */

    }, {
      key: '$emit',
      value: function $emit(event) {
        var cbs = this._events[event];
        var args = slice(arguments, 1);
        if (cbs) {
          for (var i = 0, l = cbs.length; i < l; i++) {
            var cb = cbs[i];
            cb.apply(this, args);
          }
        }
      }
    }]);
    return Event;
  }();

  /**
   * Created by zhangran on 16/6/2.
   */

  /**
   * 依赖列表
   */

  var dep = {
    now: null,

    /**
     * 触发依赖列表
     * @param deps 依赖列表
     */

    emitDeps: function emitDeps(deps) {
      var computedObj = void 0;
      for (var i = 0, l = deps.length; i < l; i++) {
        computedObj = deps[i];
        this[computedObj.name] = computedObj.fn.call(this);
      }
    }
  };

  /**
   * 封装data => class, 添加属性读取器
   * @param data
   * @param MY class
   * @returns {Data} 类 Data
   */

  function initData (data, MY) {
    return deepObjectIn(data, MY, 1);
  }

  /**
   * 判断data值是否是对象, 是的话首先观察
   * @param data
   * @param root
   * @param type : 1 MY | 2 : deepObj
   * @returns {InnerData}
   */

  function deepObjectIn(data, extendsClass, type) {
    var InnerData = function InnerData() {
      babelHelpers.classCallCheck(this, InnerData);
    };

    var extendInstance = void 0;
    if (type === 1) {
      var _InnerData = function (_extendsClass) {
        babelHelpers.inherits(_InnerData, _extendsClass);

        function _InnerData() {
          babelHelpers.classCallCheck(this, _InnerData);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(_InnerData).apply(this, arguments));
        }

        return _InnerData;
      }(extendsClass);
    } else if (type === 2) {
      var _InnerData2 = function _InnerData2() {
        babelHelpers.classCallCheck(this, _InnerData2);
      };
    }

    var _loop = function _loop(innerItem) {
      var _val = void 0,
          _deps = [];

      var InnerDataNoop = function (_InnerData3) {
        babelHelpers.inherits(InnerDataNoop, _InnerData3);

        function InnerDataNoop() {
          babelHelpers.classCallCheck(this, InnerDataNoop);

          var _this2 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(InnerDataNoop).call(this));

          if (type === 1) {
            extendInstance = _this2;
          } else {
            extendInstance = extendsClass;
          }

          if (Array.isArray(data[innerItem])) {} else if (babelHelpers.typeof(data[innerItem]) === 'object') {
            var InnerDataClass = deepObjectIn(data[innerItem], extendInstance, 2);
            _this2[innerItem] = new InnerDataClass();
          } else {
            _this2[innerItem] = data[innerItem];
          }
          return _this2;
        }

        babelHelpers.createClass(InnerDataNoop, [{
          key: innerItem,
          get: function get() {

            console.log(innerItem);

            if (dep.now !== null) {
              _deps.push(dep.now);
            }

            return _val;
          },
          set: function set(value) {

            if (value === _val) {
              return;
            }

            _val = value;

            var self = void 0;
            if (type === 1) {
              self = this;
            } else if (type === 2) {
              self = extendInstance;
            }

            dep.emitDeps.call(self, _deps);
          }
        }]);
        return InnerDataNoop;
      }(InnerData);

      InnerData = InnerDataNoop;
    };

    for (var innerItem in data) {
      _loop(innerItem);
    }

    return InnerData;
  }

  /**
   * 封装 computed => class, 添加计算属性读取器
   * @param computed computed options
   * @param MY MY Class
   * @returns {Computed} Class extends Data...
   */

  function initComputed (computed, MY) {
    var ComputedClass = function (_MY) {
      babelHelpers.inherits(ComputedClass, _MY);

      function ComputedClass() {
        babelHelpers.classCallCheck(this, ComputedClass);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ComputedClass).apply(this, arguments));
      }

      return ComputedClass;
    }(MY);

    var C1 = getComputedClass(ComputedClass, computed, true);
    var C2 = getComputedClass(C1, computed, false);

    return C2;
  }

  /**
   * 计算表达式 => Class
   * @param ComputedClass 类
   * @param computed option computed
   * @param addDep 是否注册依赖
   * @returns {*}
   */

  function getComputedClass(ComputedClass, computed, addDep) {
    var _loop = function _loop(item) {
      var _val = void 0,
          _deps = [];

      var ComputedNoop = function (_ComputedClass) {
        babelHelpers.inherits(ComputedNoop, _ComputedClass);

        function ComputedNoop() {
          babelHelpers.classCallCheck(this, ComputedNoop);

          var _this2 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ComputedNoop).call(this));

          if (addDep) {
            dep.now = {
              name: item,
              fn: computed[item]
            };
          }
          _this2[item] = computed[item].call(_this2);
          if (addDep) {
            dep.now = null;
          }
          return _this2;
        }

        babelHelpers.createClass(ComputedNoop, [{
          key: item,
          get: function get() {
            if (dep.now) {
              _deps.push(dep.now);
            }
            return _val;
          },
          set: function set(value) {
            if (value === _val) {
              return;
            }
            _val = value;

            dep.emitDeps.call(this, _deps);
          }
        }]);
        return ComputedNoop;
      }(ComputedClass);

      ComputedClass = ComputedNoop;
    };

    for (var item in computed) {
      _loop(item);
    }

    return ComputedClass;
  }

  function index (options) {
    var $el = document.querySelector(options.el);
    var data = options.data;
    var computed = options.computed;

    var MY = function (_Event) {
      babelHelpers.inherits(MY, _Event);

      function MY() {
        babelHelpers.classCallCheck(this, MY);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(MY).apply(this, arguments));
      }

      return MY;
    }(Event);

    MY = initData(data, MY);
    MY = initComputed(computed, MY);

    var vm = new MY();
    return vm;
  }

  return index;

}));