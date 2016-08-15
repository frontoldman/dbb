import { getType, toArray } from '../../utils'
import prototypeDefine from '../prototypeDefine'
import excute from '../excute'

//数组的监听
export default function loopArray(value, vm, deepLoopIn, deps, root){
	var i = 0, 
		l = value.length;

	[
	  'push',
	  'pop',
	  'shift',
	  'unshift',
	  'splice',
	  'sort',
	  'reverse'
	].forEach(method => {
		var originMethod = value[method]

		vm[method] = function(){
			var args = toArray(arguments);
			var result = originMethod.apply(value, args);
			

			switch(method) {
				case 'push': //末尾插入元素
					defOrDeep(value, l, vm, root);
					break;
				case 'pop': //删除末尾元素
					delete vm[l-1];
					break;	
				case 'shift': //删除头部元素
					for(i = 0; i<l-1 ;i++){
						vm[i] = vm[i+1];
					}
					delete vm[i];
					break;	
				case 'unshift': //往头部添加元素
					var changeSize = result - l;
					for(i = result-1; i>=0 ;i--){
						if(i<changeSize){
							vm[i] = value[i];
						}else{
							vm[i] = vm[i-changeSize];
						}
					}
					break;
				case 'splice':
					var argsSize = args.length;
					//截断了元素
					if(result.length){

					}else{	//没有截断元素
						for(i = args[0];i<value.length;i++){
							
						}
					}
					break;		
			}

			l = value.length;
			vm.length = l;

			excute(deps.elems, deps.relays, root);

			//push unshift splice

		}
	})


	vm['join'] = function(chart) {
		return toArray(vm).join(chart);
	}

	for(; i<l ; i++){
		defOrDeep(value, i, vm, root);
	}

	vm.length = l;
}

//定义或者深入
function defOrDeep(value, i, vm, root) {
	var valTarget = value[i];

	if(typeof valTarget === 'object'){
		deepLoopIn(valTarget, i, vm, root);
	}else{
		prototypeDefine(valTarget, i, vm, root);
	}
}
