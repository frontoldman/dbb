import { element } from '../compiler/index'

export default function protptypeDefine(outValue, key, vm) {
	var _val = outValue,
		elems = [];
	Object.defineProperty(vm, key, {
	  enumerable: true,
	  configurable: false,
	  set(value) {
	  	if(value !== _val){
	  		_val = value;
	  		elems.forEach(elem => {
	  			console.log(elem)
	  			elem.directive(elem.target, elem.express(vm));
	  		})
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
	  	return _val;
	  }
	});
}