/**
 * Created by zhangran on 16/6/1.
 */

import dep from "./dep";

class Noop {
}

/**
 * 封装data => class, 添加属性读取器
 * @param data
 * @param MY class
 * @returns {Data} 类 Data
 */

export default function (data, MY) {
  return deepObjectIn(data, MY, null, 1);
}


/**
 * 判断data值是否是对象, 是的话首先观察
 * @param data
 * @param extendsClass
 * @param vm vm实例
 * @param type : 1 MY | 2 : deepObj
 * @returns {InnerData}
 */

function deepObjectIn(data, extendsClass, vm, type) {
  class InnerData extends extendsClass {
  }
  let extendInstance

  for (let innerItem in data) {
    let _val, _deps = [];
    class InnerDataNoop extends InnerData {
      constructor() {
        super()

        if (type === 1) {
          extendInstance = this;
        } else {
          extendInstance = vm;
        }

        _val = checkTypeIn(data[innerItem], extendInstance)
      }

      get [innerItem]() {

        dep.plusDeps(_deps);
        return _val;
      }

      set [innerItem](value) {

        if (value === _val) {
          return;
        }

        /**
         * 判断type, 确保this是根节点
         */

        let self;
        if (type === 1) {
          self = this;
        } else if (type === 2) {
          self = extendInstance;
        }

        _val = checkTypeIn(value, extendInstance);

        if(Array.isArray(value) || typeof value === 'object'){
          self.$emit('add-dep', innerItem)
        }

        dep.emitDeps.call(self, _deps)
      }
    }

    InnerData = InnerDataNoop;
  }

  return InnerData;
}


/**
 * 判断data值是否是数组, 是的话首先观察, 数组已经被转换成了对象
 * @param data
 * @param root
 */

function deepArrayIn(data, root) {
  class InnerData {
  }

  for (let i = 0, l = data.length; i < l; i++) {
    let _val, _deps = [];
    class InnerDataNoop extends InnerData {
      constructor() {
        super()
        _val = checkTypeIn(data[i], root)
      }

      get [i]() {
        dep.plusDeps(_deps);
        return _val;
      }

      set [i](value) {
        if (value === _val) {
          return;
        }
        _val = value;
        dep.emitDeps.call(root, _deps)
      }

      push(value) {

      }
    }

    InnerData = InnerDataNoop;
  }

  return InnerData;
}


/**
 * 判断数据类型, 使用监听对象
 * @param value
 * @param extendInstance
 * @returns {*}
 */

function checkTypeIn(value, extendInstance){
  if (Array.isArray(value)) {
    let InnerDataClass = deepArrayIn(value, extendInstance);
    return new InnerDataClass();
  } else if (typeof value === 'object') {
    let InnerDataClass = deepObjectIn(value, Noop, extendInstance, 2);
    return new InnerDataClass();
  } else {
    return value;
  }
}