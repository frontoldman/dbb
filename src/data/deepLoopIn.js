import loopArray from './array'
import loopObject from './object'
import { getType } from '../utils'

/**
*	val: 值
**/
export default function deepLoopIn(val, vm, root) {
	var typeOfItem = getType(val);

	switch(typeOfItem) {
		case 'array':
			loopArray(val, vm, deepLoopIn, root);
			break;
		case 'object':
			loopObject(val, vm, deepLoopIn, root);
			break;
	}
}