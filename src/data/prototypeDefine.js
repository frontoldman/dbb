import { element } from '../compiler/index'
import Dep from  '../Dep'

export default function protptypeDefine(outValue, key, vm, root) {
	var _val = outValue,
		elems = [],
		relays = [];

	Object.defineProperty(vm, key, {
	  enumerable: true,
	  configurable: false,
	  set(value) {
	  	if(value !== _val){
	  		_val = value;
	  		elems.forEach(elem => {
	  			elem.directive(elem.target, elem.express(root));
	  		})

	  		relays.forEach(relay => {
	  			
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

	  	if(Dep.now){
	  		relays.push({
	  			key: Dep.now
	  		})
	  	}
	  	return _val;
	  }
	});
}