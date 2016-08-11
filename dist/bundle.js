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

	function path (nodeValue) {
		var l = nodeValue.length;
		var pathString = '';
		var valAry = [];

		var inSingleQuotes = false;
		var isOperator = false;
		var isNumber = false;
		var isParenthesis = false;

		for (var i = 0; i < l; i++) {
			var charOfValue = nodeValue.charAt(i);

			//在单引号内部
			if (inSingleQuotes && charOfValue !== "'") {
				valAry.push(charOfValue);
				continue;
			}

			if (!valAry.length && /\d/.test(charOfValue)) {
				isNumber = true;
				pathString += charOfValue;
				continue;
			}

			isNumber = false;

			switch (charOfValue) {
				case '+':
					//+
					reset();
					pathString += ' + ';
					break;
				case '-':
					reset();
					pathString += ' - ';
					break;
				case '*':
					reset();
					pathString += ' * ';
					break;
				case '/':
					reset();
					pathString += ' / ';
					break;
				case ' ':
					pathString += charOfValue;
					break;
				case '(':
					reset();
					pathString += ' ( ';
					break;
				case ')':
					reset();
					pathString += ' ) ';
					break;
				case "'":
					if (inSingleQuotes) {
						inSingleQuotes = false;
						valAry.push("'");
						pathString += valAry.join('');
						valAry = [];
					} else {
						reset();
						inSingleQuotes = true;
						valAry.push("'");
					}
					break;
				case '!':
					reset();
					pathString += '!';
					break;
				case '[':
					reset();
					isParenthesis = true;
					pathString += '[';
					break;
				case ']':
					isParenthesis = false;
					reset();
					valAry = [];
					pathString += ']';
					break;
				case '?':
					reset();
					pathString += '?';
					break;
				case ':':
					reset();
					pathString += ':';
					break;
				case '|':
				case '&':
					if (valAry.length === 1 && valAry[0] === charOfValue) {
						valAry.push(charOfValue);
						pathString += charOfValue + charOfValue;
						valAry = [];
					} else {
						reset();
						valAry.push(charOfValue);
					}
					break;
				default:
					valAry.push(charOfValue);
					break;
			}
		}

		if (valAry.length) {
			pathString += 'vm.' + valAry.join('');
		}

		function reset() {
			if (i !== 0 && valAry.length) {
				pathString += 'vm.' + valAry.join('');
			}
			valAry = [];
		}

		return pathString;
	}

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
					compileNode(childElem, vm);
					break;
				case 3:
					//文本节点

					break;
			}
		});
	}

	function createFn(pathString) {
		//console.log(pathString)
		return new Function("vm", "return " + pathString);
	}

	//处理文本节点
	function compileNode(childElem, vm) {
		var attributes = childElem.attributes;
		var attrArray = toArray(attributes);

		attrArray.forEach(function (attr) {
			var nodeName = attr.nodeName;
			var nodeValue = attr.nodeValue;

			nodeName = nodeName.toLowerCase();

			directives.forEach(function (directive) {
				if (directive.directiveName === nodeName) {

					element.target = childElem;
					var pathString = path(nodeValue);
					element.express = createFn(pathString);
					element.directive = directive;
					directive(childElem, element.express(vm));
					element.target = null;
					element.express = '', element.directive = null;
				}
			});
		});
	}

	function protptypeDefine(outValue, key, vm, root) {
		var _val = outValue,
		    elems = [];
		Object.defineProperty(vm, key, {
			enumerable: true,
			configurable: false,
			set: function set(value) {
				if (value !== _val) {
					_val = value;
					elems.forEach(function (elem) {
						elem.directive(elem.target, elem.express(root));
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

	function loopArray(value, vm, deepLoopIn, root) {

		['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
			vm[method] = function () {
				value[method].apply(toArray(arguments));
			};
		});

		for (var i = 0, l = value.length; i < l; i++) {
			var valTager = value[i];
			protptypeDefine(valTager, i, value, root);
			if ((typeof valTager === 'undefined' ? 'undefined' : babelHelpers.typeof(valTager)) === 'object') {
				deepLoopIn(valTager, value, root);
			}
		}
	}

	function loopObject(value, vm, deepLoopIn, root) {
		Object.keys(value).forEach(function (item) {
			var valTager = value[item];
			protptypeDefine(valTager, item, vm, root);
			if ((typeof valTager === 'undefined' ? 'undefined' : babelHelpers.typeof(valTager)) === 'object') {
				deepLoopIn(valTager, vm[item], root);
			}
		});
	}

	/**
	*	val: 值
	**/
	function deepLoopIn(val, vm, root) {
		var typeOfItem = getType(val);

		switch (typeOfItem) {
			case 'array':
				loopArray(val, vm, deepLoopIn, root);
				break;
			case 'object':
				loopObject(val, vm, deepLoopIn, root);
				break;
		}
	}

	function dataInit (data, vm) {
		for (var key in data) {
			protptypeDefine(data[key], key, vm, vm);
			deepLoopIn(data[key], vm[key], vm);
		}
	}

	function computedInit (computed, vm) {
		Object.keys(computed).forEach(function (key) {
			var valFn = computed[key];
			valFn = valFn.bind(vm);

			Object.defineProperty(vm, key, {
				enumerable: true,
				configurable: false,
				set: function set(value) {},
				get: function get() {
					return valFn();
				}
			});
		});
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
		computedInit(computed, this);
		compiler(bootElem, this);
	}

	return DBB;

}));