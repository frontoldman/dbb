import prototypeDefine from '../prototypeDefine'

export default function loopObject(value, vm, deepLoopIn, root){
	Object.keys(value).forEach(key => {
		var valTarget = value[key];
		
		if(typeof valTarget === 'object'){
			deepLoopIn(valTarget, key, vm, root);
		}else{
			prototypeDefine(valTarget, key, vm, root);
		}
	})
}

