import { toArray } from '../utils'
import directives from '../directive/index'
import path from '../path/index'

var directiveNodes = {};

export var element = {
	target: null,
	express: '',
	directive: null
}

export default function(el, vm) {
	var childElems = el.childNodes;
	var childArray = toArray(childElems);

	childArray.forEach(childElem => {
		switch(childElem.nodeType){
			case 1: //dom节点
				compileNode(childElem, vm);
				break;
			case 3: //文本节点

				break;
		}
	})
}

function createFn(pathString) {
	//console.log(pathString)
	return new Function("vm", "return " + pathString);
}

//处理文本节点
function compileNode(childElem, vm) {
	var attributes = childElem.attributes;
	var attrArray = toArray(attributes);

	attrArray.forEach(attr => {
		var { nodeName, nodeValue} = attr;
		nodeName = nodeName.toLowerCase();

		directives.forEach(directive => {
			if(directive.directiveName === nodeName){

				element.target = childElem;
				var pathString = path(nodeValue);
				element.express = createFn(pathString);
				element.directive = directive;
				directive(childElem, element.express(vm));
				element.target = null;
				element.express = '',
				element.directive = null;

			}
		})
	})
}

