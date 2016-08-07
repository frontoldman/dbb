import loopArray from './array'
import loopObject from './object'
import { getType } from '../utils'

export default function deepLoopIn(val, vm) {
	var typeOfItem = getType(val);

	switch(typeOfItem) {
		case 'array':
			loopArray(val, vm, deepLoopIn);
			break;
		case 'object':
			loopObject(val, vm, deepLoopIn);
			break;
	}
}