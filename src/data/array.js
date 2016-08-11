import { getType, toArray } from '../utils'
import prototypeDefine from './prototypeDefine'

export default function loopArray(value, vm, deepLoopIn, root){

	[
	  'push',
	  'pop',
	  'shift',
	  'unshift',
	  'splice',
	  'sort',
	  'reverse'
	].forEach(method => {
		vm[method] = function(){
			value[method].apply(toArray(arguments));
		}
	})

	for(var i = 0, l = value.length ; i<l ; i++){
		var valTager = value[i];
		prototypeDefine(valTager, i, value, root);
		if(typeof valTager === 'object'){
			deepLoopIn(valTager, value, root);
		}
	}

}
