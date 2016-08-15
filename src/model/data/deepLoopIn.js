import loopArray from './array'
import loopObject from './object'
import { getType } from '../../utils'
import prototypeDefine from '../prototypeDefine'

/**
*	val: 值
**/
export default function deepLoopIn(val, key, vm, root) {
	var typeOfItem = getType(val);

	switch(typeOfItem) {
		case 'array':
			var deps = prototypeDefine({}, key, vm, root);
			loopArray(val, vm[key], deepLoopIn, deps, root);
			break;
		case 'object':
			prototypeDefine({}, key, vm, root);
			loopObject(val, vm[key], deepLoopIn, root);
			break;
	}
}