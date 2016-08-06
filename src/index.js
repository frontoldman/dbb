import { getType } from './utils'
import dataInit from './data/index.js'

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

	dataInit(data, this);

}

export default DBB;





