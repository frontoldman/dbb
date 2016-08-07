import prototypeDefine from './prototypeDefine'

export default function loopObject(value, vm, deepLoopIn){
	Object.keys(value).forEach(item => {
		var valTager = value[item];
		prototypeDefine(valTager, item, value);
		if(typeof valTager === 'object'){
			deepLoopIn(valTager, value);
		}
	})
}

