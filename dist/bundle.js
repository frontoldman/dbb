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
    },

    /**
     * 添加字段依赖
     * @param _deps
     */

    plusDeps: function plusDeps(_deps) {

      if (this.now !== null) {
        for (var i = 0, l = _deps.length; i < l; i++) {
          if (_deps[i].name === this.now.name) {
            return _deps;
          }
        }
        _deps.push(this.now);
      }

      return _deps;
    }

  };

  var Noop = function Noop() {
    babelHelpers.classCallCheck(this, Noop);
  };

  /**
   * 封装data => class, 添加属性读取器
   * @param data
   * @param MY class
   * @returns {Data} 类 Data
   */

  function initData (data, MY) {
    return deepObjectIn(data, MY, null, 1);
  }

  /**
   * 判断data值是否是对象, 是的话首先观察
   * @param data
   * @param extendsClass
   * @param vm vm实例
   * @param type : 1 MY | 2 : deepObj
   * @returns {InnerData}
   */

  function deepObjectIn(data, extendsClass, vm, type) {
    var InnerData = function (_extendsClass) {
      babelHelpers.inherits(InnerData, _extendsClass);

      function InnerData() {
        babelHelpers.classCallCheck(this, InnerData);
        return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(InnerData).apply(this, arguments));
      }

      return InnerData;
    }(extendsClass);

    var extendInstance = void 0;

    var _loop = function _loop(innerItem) {
      var _val = void 0,
          _deps = [];

      var InnerDataNoop = function (_InnerData) {
        babelHelpers.inherits(InnerDataNoop, _InnerData);

        function InnerDataNoop() {
          babelHelpers.classCallCheck(this, InnerDataNoop);

          var _this2 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(InnerDataNoop).call(this));

          if (type === 1) {
            extendInstance = _this2;
          } else {
            extendInstance = vm;
          }

          _val = checkTypeIn(data[innerItem], extendInstance);
          return _this2;
        }

        babelHelpers.createClass(InnerDataNoop, [{
          key: innerItem,
          get: function get() {

            dep.plusDeps(_deps);
            return _val;
          },
          set: function set(value) {

            if (value === _val) {
              return;
            }

            /**
             * 判断type, 确保this是根节点
             */

            var self = void 0;
            if (type === 1) {
              self = this;
            } else if (type === 2) {
              self = extendInstance;
            }

            _val = checkTypeIn(value, extendInstance);

            if (Array.isArray(value) || (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object') {
              self.$emit('add-dep', innerItem);
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
   * 判断data值是否是数组, 是的话首先观察, 数组已经被转换成了对象
   * @param data
   * @param root
   */

  function deepArrayIn(data, root) {
    var InnerData = function InnerData() {
      babelHelpers.classCallCheck(this, InnerData);
    };

    var _loop2 = function _loop2(i, l) {
      var _val = void 0,
          _deps = [];

      var InnerDataNoop = function (_InnerData2) {
        babelHelpers.inherits(InnerDataNoop, _InnerData2);

        function InnerDataNoop() {
          babelHelpers.classCallCheck(this, InnerDataNoop);

          var _this3 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(InnerDataNoop).call(this));

          _val = checkTypeIn(data[i], root);
          return _this3;
        }

        babelHelpers.createClass(InnerDataNoop, [{
          key: 'push',
          value: function push(value) {}
        }, {
          key: i,
          get: function get() {
            dep.plusDeps(_deps);
            return _val;
          },
          set: function set(value) {
            if (value === _val) {
              return;
            }
            _val = value;
            dep.emitDeps.call(root, _deps);
          }
        }]);
        return InnerDataNoop;
      }(InnerData);

      InnerData = InnerDataNoop;
    };

    for (var i = 0, l = data.length; i < l; i++) {
      _loop2(i, l);
    }

    return InnerData;
  }

  /**
   * 判断数据类型, 使用监听对象
   * @param value
   * @param extendInstance
   * @returns {*}
   */

  function checkTypeIn(value, extendInstance) {
    if (Array.isArray(value)) {
      var InnerDataClass = deepArrayIn(value, extendInstance);
      return new InnerDataClass();
    } else if ((typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object') {
      var _InnerDataClass = deepObjectIn(value, Noop, extendInstance, 2);
      return new _InnerDataClass();
    } else {
      return value;
    }
  }

  /**
   * 封装 computed => class, 添加计算属性读取器
   * @param computed computed options
   * @param MY MY Class
   * @returns {Computed} Class extends Data...
   */

  function initComputed (computed, MY) {

    var C1 = getComputedClass(MY, computed, true);
    var C2 = getComputedClass(MY, computed, false, new C1());

    return C2;
  }

  /**
   * 计算表达式 => Class
   * @param ComputedClass 类
   * @param computed option computed
   * @param addDep 是否注册依赖
   * @param self this指向
   * @returns {*}
   */

  function getComputedClass(ComputedClass, computed, addDep, self) {
    var _loop = function _loop(item) {
      var _val = void 0,
          _deps = [];

      var ComputedNoop = function (_ComputedClass) {
        babelHelpers.inherits(ComputedNoop, _ComputedClass);

        function ComputedNoop() {
          babelHelpers.classCallCheck(this, ComputedNoop);

          var _this2 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ComputedNoop).call(this));

          dep.now = {
            name: item,
            fn: computed[item]
          };
          var _this = void 0;
          if (self) {
            _this = self;
          } else {
            _this = _this2;
          }
          _this2[item] = _val = computed[item].call(_this);
          dep.now = null;
          if (!addDep) {
            _this2.$on('add-dep', function (name) {
              for (var innerItem in computed) {
                dep.now = {
                  name: innerItem,
                  fn: computed[innerItem]
                };
                computed[innerItem].call(self);
                dep.now = null;
              }
            });
          }
          return _this2;
        }

        babelHelpers.createClass(ComputedNoop, [{
          key: item,
          get: function get() {

            dep.plusDeps(_deps);

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