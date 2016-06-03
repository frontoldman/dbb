/**
 * Created by zhangran on 16/5/31.
 */
import {slice} from "../utils";
import {interpolationBegin as iB, interpolationEnd as iE} from "../config";

const interpolationReg = new RegExp(`${iB}((?:.|\\n)+?)${iE}`, 'img');

/**
 * 编译dom
 * @param $el
 */

export default function ($el) {

  const childNodes = $el.childNodes;
  const childAry = slice(childNodes);

  childAry.forEach(child => {
    distribution(child, vm);
  })
}

/**
 * 分发节点编译
 * @param node
 * @param vm
 */

function distribution(node, vm) {
  const {nodeType} = node;
  switch (nodeType) {
    case 1:
      break;
    case 3:
      parseTextNode(node, vm);
      break;
  }
}


/**
 * 编译text文本节点
 * @param node text dom 节点
 * @param vm vm实例
 */

function parseTextNode(node, vm) {
  const {nodeValue} = node;
  let execResult;

  while (execResult = interpolationReg.exec(nodeValue)) {
    //console.log(vm.data)
  }

}