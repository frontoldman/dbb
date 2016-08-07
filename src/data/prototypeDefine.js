
export default function protptypeDefine(outValue, key, vm) {
	var _val = outValue;
	Object.defineProperty(vm, key, {
	  enumerable: true,
	  configurable: false,
	  set(value) {
	  	if(value !== _val){
	  		_val = value;
	  	}
	  },
	  get() {
	  	return _val;
	  }
	});
}