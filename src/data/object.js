import prototypeDefine from './prototypeDefine'

export default function loopObject(value, vm, deepLoopIn, root){
	Object.keys(value).forEach(item => {
		var valTager = value[item];
		prototypeDefine(valTager, item, vm, root);
		if(typeof valTager === 'object'){
			deepLoopIn(valTager, vm[item], root);
		}
	})
}

