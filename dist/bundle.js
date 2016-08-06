(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.DBB = factory());
}(this, function () { 'use strict';

	var typeReg = /\[object\s+(.*)\]/;

	function getType(obj) {
		var typeString = Object.prototype.toString.call(obj);
		var result = typeString.match(typeReg);
		if (result && result.length) {
			return result[1].toLowerCase();
		}
		return obj;
	}

	function dataInit (data, vm) {

		for (var key in data) {
			(function () {
				var _val = data[key];
				Object.defineProperty(vm, key, {
					enumerable: true,
					configurable: false,
					set: function set(value) {
						_val = value;
					},
					get: function get() {
						return _val;
					}
				});
			})();
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