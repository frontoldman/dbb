

export default function(nodeValue) {
	var l = nodeValue.length;
	var pathString = '';
	var valAry = [];

	for(var i = 0; i<l ; i++){
		var charOfValue = nodeValue.charAt(i);
		console.log(charOfValue)
		switch(charOfValue) {
			case '+': //+
				if(i !== 0){
					pathString += 'vm.' + valAry.join('');
				}

				pathString += ' + ';
				valAry = [];
				break;
			case '-':
				break;
			case '*':
				break;
			case '/':
				break;
			case ' ':
				break;	
			default:
				valAry.push(charOfValue);
				break;			
		}
	}

	if(valAry.length){
		pathString += 'vm.' + valAry.join('');
	}

	console.log(pathString);

	return pathString;
}