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

	function loopArray() {}

	function protptypeDefine(outValue, key, vm) {
		var _val = outValue;
		Object.defineProperty(vm, key, {
			enumerable: true,
			configurable: false,
			set: function set(value) {
				if (value !== _val) {
					_val = value;
				}
			},
			get: function get() {
				return _val;
			}
		});
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

		dataInit(data, this);
	}

	return DBB;

}));