(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.DBB = factory());
}(this, function () { 'use strict';

	var babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	};
	babelHelpers;

	var typeReg = /\[object\s+(.*)\]/;

	function getType(obj) {
		var typeString = Object.prototype.toString.call(obj);
		var result = typeString.match(typeReg);
		if (result && result.length) {
			return result[1].toLowerCase();
		}
		return obj;
	}

	function toArray(arrayLike) {
		return [].slice.apply(arrayLike);
	}

	function bind(el, value) {
		el.textContent = value;
	}

	bind.directiveName = 'bind';

	var directives = [bind];

	var element = {
		target: null,
		express: '',
		directive: null
	};

	function compiler (el, vm) {
		var childElems = el.childNodes;
		var childArray = toArray(childElems);

		childArray.forEach(function (childElem) {
			switch (childElem.nodeType) {
				case 1:
					//dom节点
					var attributes = childElem.attributes;
					var attrArray = toArray(attributes);

					attrArray.forEach(function (attr) {
						var nodeName = attr.nodeName;
						var nodeValue = attr.nodeValue;

						nodeName = nodeName.toLowerCase();

						directives.forEach(function (directive) {
							if (directive.directiveName === nodeName) {

								element.target = childElem;
								element.express = createFn(nodeValue);
								element.directive = directive;
								directive(childElem, vm[nodeValue]);
								element.target = null;
								element.express = '', element.directive = null;
							}
						});
					});

					break;
				case 3:
					//文本节点

					break;
			}
		});
	}

	function createFn(path) {
		return new Function("vm", "return vm." + path);
	}

	function protptypeDefine(outValue, key, vm) {
		var _val = outValue,
		    elems = [];
		Object.defineProperty(vm, key, {
			enumerable: true,
			configurable: false,
			set: function set(value) {
				if (value !== _val) {
					_val = value;
					elems.forEach(function (elem) {
						console.log(elem);
						elem.directive(elem.target, elem.express(vm));
					});
				}
			},
			get: function get() {
				if (element.target) {
					elems.push({
						target: element.target,
						express: element.express,
						directive: element.directive
					});
				}
				return _val;
			}
		});
	}

	function loopArray(value, vm, deepLoopIn) {

		['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
			vm[method] = function () {
				value[method].apply(toArray(arguments));
			};
		});

		for (var i = 0, l = value.length; i < l; i++) {
			var valTager = value[i];
			protptypeDefine(valTager, i, value);
			if ((typeof valTager === 'undefined' ? 'undefined' : babelHelpers.typeof(valTager)) === 'object') {
				deepLoopIn(valTager, value);
			}
		}
	}

	function loopObject(value, vm, deepLoopIn) {
		Object.keys(value).forEach(function (item) {
			var valTager = value[item];
			protptypeDefine(valTager, item, value);
			if ((typeof valTager === 'undefined' ? 'undefined' : babelHelpers.typeof(valTager)) === 'object') {
				deepLoopIn(valTager, value);
			}
		});
	}

	function deepLoopIn(val, vm) {
		var typeOfItem = getType(val);

		switch (typeOfItem) {
			case 'array':
				loopArray(val, vm, deepLoopIn);
				break;
			case 'object':
				loopObject(val, vm, deepLoopIn);
				break;
		}
	}

	function dataInit (data, vm) {
		for (var key in data) {
			protptypeDefine(data[key], key, vm);
			deepLoopIn(data[key], vm[key]);
		}
	}

	function DBB(config) {

		if (!(this instanceof DBB)) {
			return new DBB(config);
		}

		var bootElem = document.querySelector(config.el);

		var data = config.data;
		var computed = config.computed;

		if (data && getType(data) !== 'object') {
			throw new Error('option data must be Object type');
		}

		if (computed && getType(computed) !== 'object') {
			throw new Error('option computed must be Object type');
		}

		// this.directives = directives;

		dataInit(data, this);
		compiler(bootElem, this);
	}

	return DBB;

}));