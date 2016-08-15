
//执行依赖集合
export default function(elems, relays, root) {

	elems.forEach(elem => {
		elem.directive(elem.target, elem.express(root));
	})

	relays.forEach(relay => {
		var valFn = relay.valFn;
		var key = relay.key;
		root[key] = valFn();
	})
}