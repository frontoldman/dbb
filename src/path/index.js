

export default function(nodeValue) {
	var l = nodeValue.length;
	var pathString = '';
	var valAry = [];

	var inSingleQuotes = false;
	var isOperator = false;
	var isNumber = false;
	var isParenthesis = false;

	for(var i = 0; i<l ; i++){
		var charOfValue = nodeValue.charAt(i);
		
		//在单引号内部
		if(inSingleQuotes && charOfValue !== "'"){
			valAry.push(charOfValue);
			continue;
		}

		if(!valAry.length && /\d/.test(charOfValue)){
			isNumber = true;
			pathString += charOfValue;
			continue;
		}

		isNumber = false;

		switch(charOfValue) {
			case '+': //+
				reset();
				pathString += ' + ';
				break;
			case '-':
				reset();
				pathString += ' - ';
				break;
			case '*':
				reset();
				pathString += ' * ';
				break;
			case '/':
				reset();
				pathString += ' / ';
				break;
			case ' ':
				pathString += charOfValue;
				break;
			case '(':
				reset();
				pathString += ' ( ';
				break;	
			case ')':
				reset();
				pathString += ' ) ';
				break;	
			case "'":
				if(inSingleQuotes){
					inSingleQuotes = false;
					valAry.push("'");
					pathString += valAry.join(''); 
					valAry = [];
				}else{
					reset();
					inSingleQuotes = true;
					valAry.push("'")
				}
				break;	
			case '!':
				reset();
				pathString += '!';
				break;
			case '[':
				reset();
				isParenthesis = true;
				pathString += '['; 
				break;	
			case ']':
				isParenthesis = false;
				reset();
				valAry = [];
				pathString += ']';
				break;
			case '?':
				reset();
				pathString += '?';
				break;
			case ':':
				reset();
				pathString += ':';
				break;	
			case '|':	
			case '&':
				if(valAry.length === 1 && valAry[0] === charOfValue){
					valAry.push(charOfValue);
					pathString += (charOfValue + charOfValue);
					valAry = [];					
				}else{
					reset();
					valAry.push(charOfValue);
				}
				break;				
			default:
				valAry.push(charOfValue);
				break;			
		}
	}

	if(valAry.length){
		pathString += 'vm.' + valAry.join('');
	}

	function reset() {
		if(i !== 0 && valAry.length){
			pathString += 'vm.' + valAry.join('');
		}
		valAry = [];
	}

	return pathString;
}

