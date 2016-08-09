import { getType } from './utils'
import dataInit from './data/index'
import compiler from './compiler/index'


function DBB(config) {

	if(!(this instanceof DBB)){
		return new DBB(config);
	}

	var bootElem = document.querySelector(config.el);
	
	var data = config.data;
	var computed = config.computed;

	if(data && getType(data) !== 'object'){
		throw new Error('option data must be Object type');
	}

	if(computed && getType(computed) !== 'object'){
		throw new Error('option computed must be Object type');
	}

	// this.directives = directives;

	dataInit(data, this);
	compiler(bootElem, this);


}

export default DBB;





