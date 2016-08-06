

export default function(data, vm){

	for(var key in data){
		(function(){
			var _val = data[key];
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
		})()
	}

}