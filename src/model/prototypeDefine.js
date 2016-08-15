import { element } from '../compiler/index'
import Dep from  '../Dep'
import excute from './excute'

export default function protptypeDefine(outValue, key, vm, root) {
	var _val,
		isComputed = false,
		_valFn ,
		elems = [],
		relays = [];

	if(typeof outValue === 'function'){
		isComputed = true;
		_valFn = outValue.bind(vm);
		_val = undefined;
	}else{
		_val = outValue;
	}	

	Object.defineProperty(vm, key, {
	  enumerable: true,
	  configurable: true,
	  set(value) {
	  	if(value !== _val){
	  		_val = value;
	  		excute(elems, relays, root);
	  	}
	  },
	  get() {

	  	if(element.target){
			elems.push({
				target: element.target,
				express: element.express,
				directive: element.directive
			})
	  	}

	  	if(Dep.now){
	  		relays.push({
	  			key: Dep.now,
	  			valFn: Dep.valFn
	  		})
	  	}

	  	if(isComputed && !_val){
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
		elems,
		relays
	}
}