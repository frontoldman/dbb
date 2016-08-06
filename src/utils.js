const typeReg = /\[object\s+(.*)\]/;

export function isArray(obj){
	return Array.isArray(obj);
}


export function getType(obj){
	var typeString = Object.prototype.toString.call(obj);
	var result = typeString.match(typeReg);
	if(result && result.length){
		return result[1].toLowerCase();
	}
	return obj;
}