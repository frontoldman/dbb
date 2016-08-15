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

	var Dep = {
		now: null
	};

	//执行依赖集合
	function excute (elems, relays, root) {

		elems.forEach(function (elem) {
			elem.directive(elem.target, elem.express(root));
		});

		relays.forEach(function (relay) {
			var valFn = relay.valFn;
			var key = relay.key;
			root[key] = valFn();
		});
	}

	function protptypeDefine(outValue, key, vm, root) {
		var _val,
		    isComputed = false,
		    _valFn,
		    elems = [],
		    relays = [];

		if (typeof outValue === 'function') {
			isComputed = true;
			_valFn = outValue.bind(vm);
			_val = undefined;
		} else {
			_val = outValue;
		}

		Object.defineProperty(vm, key, {
			enumerable: true,
			configurable: true,
			set: function set(value) {
				if (value !== _val) {
					_val = value;
					excute(elems, relays, root);
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

				if (Dep.now) {
					relays.push({
						key: Dep.now,
						valFn: Dep.valFn
					});
				}

				if (isComputed && !_val) {
					Dep.now = key;
					Dep.valFn = _valFn;
					_val = _valFn();
					Dep.now = null;
					Dep.valFn = null;
				}

				return _val;
			}
		});

		return {
			elems: elems,
			relays: relays
		};
	}

	//数组的监听
	function loopArray(value, vm, deepLoopIn, deps, root) {
		var i = 0,
		    l = value.length;

		['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
			var originMethod = value[method];

			vm[method] = function () {
				var args = toArray(arguments);
				var result = originMethod.apply(value, args);

				switch (method) {
					case 'push':
						//末尾插入元素
						defOrDeep(value, l, vm, root);
						break;
					case 'pop':
						//删除末尾元素
						delete vm[l - 1];
						break;
					case 'shift':
						//删除头部元素
						for (i = 0; i < l - 1; i++) {
							vm[i] = vm[i + 1];
						}
						delete vm[i];
						break;
					case 'unshift':
						//往头部添加元素
						var changeSize = result - l;
						for (i = result - 1; i >= 0; i--) {
							if (i < changeSize) {
								vm[i] = value[i];
							} else {
								vm[i] = vm[i - changeSize];
							}
						}
						break;
				}

				l = value.length;
				vm.length = l;

				excute(deps.elems, deps.relays, root);

				//push unshift splice
			};
		});

		vm['join'] = function (chart) {
			return toArray(vm).join(chart);
		};

		for (; i < l; i++) {
			defOrDeep(value, i, vm, root);
		}

		vm.length = l;
	}

	//定义或者深入
	function defOrDeep(value, i, vm, root) {
		var valTarget = value[i];

		if ((typeof valTarget === 'undefined' ? 'undefined' : babelHelpers.typeof(valTarget)) === 'object') {
			deepLoopIn(valTarget, i, vm, root);
		} else {
			protptypeDefine(valTarget, i, vm, root);
		}
	}

	function loopObject(value, vm, deepLoopIn, root) {
		Object.keys(value).forEach(function (key) {
			var valTarget = value[key];

			if ((typeof valTarget === 'undefined' ? 'undefined' : babelHelpers.typeof(valTarget)) === 'object') {
				deepLoopIn(valTarget, key, vm, root);
			} else {
				protptypeDefine(valTarget, key, vm, root);
			}
		});
	}

	/**
	*	val: 值
	**/
	function deepLoopIn$1(val, key, vm, root) {
		var typeOfItem = getType(val);

		switch (typeOfItem) {
			case 'array':
				var deps = protptypeDefine({}, key, vm, root);
				loopArray(val, vm[key], deepLoopIn$1, deps, root);
				break;
			case 'object':
				protptypeDefine({}, key, vm, root);
				loopObject(val, vm[key], deepLoopIn$1, root);
				break;
		}
	}

	function dataInit (data, vm) {
		for (var key in data) {
			if (babelHelpers.typeof(data[key]) === 'object') {
				deepLoopIn$1(data[key], key, vm, vm);
			} else {
				protptypeDefine(data[key], key, vm, vm);
			}
		}
	}

	function computedInit (computed, vm) {
		Object.keys(computed).forEach(function (key) {
			protptypeDefine(computed[key], key, vm, vm);
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