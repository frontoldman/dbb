import deepLoopIn from './deepLoopIn'
import prototypeDefine from '../prototypeDefine'

export default function(data, vm){
	for(var key in data){
		if(typeof data[key] === 'object'){
			deepLoopIn(data[key], key, vm, vm);
		}else{
			prototypeDefine(data[key], key, vm, vm);
		}
	}
}




