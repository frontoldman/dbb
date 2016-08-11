import deepLoopIn from './deepLoopIn'
import prototypeDefine from './prototypeDefine'

export default function(data, vm){
	for(var key in data){
		prototypeDefine(data[key], key, vm, vm);
		deepLoopIn(data[key], vm[key], vm);
	}
}




