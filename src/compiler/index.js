import { toArray } from '../utils'
import directives from '../directive/index'

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
				var attributes = childElem.attributes;
				var attrArray = toArray(attributes);

				attrArray.forEach(attr => {
					var { nodeName, nodeValue} = attr;
					nodeName = nodeName.toLowerCase();

					directives.forEach(directive => {
						if(directive.directiveName === nodeName){

							element.target = childElem;
							element.express = createFn(nodeValue);
							element.directive = directive;
							directive(childElem, vm[nodeValue]);
							element.target = null;
							element.express = '',
							element.directive = null;
						}
					})

				})

				break;
			case 3: //文本节点

				break;
		}
	})
}

function createFn(path) {
	return new Function("vm", "return vm." + path);
}

