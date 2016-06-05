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

        if (Array.isArray(data[innerItem])) {
          let InnerDataClass = deepArrayIn(data[innerItem], extendInstance);
          this[innerItem] = _val = new InnerDataClass();
        } else if (typeof data[innerItem] === 'object') {
          let InnerDataClass = deepObjectIn(data[innerItem], Noop, extendInstance, 2);
          this[innerItem] = _val = new InnerDataClass();
        } else {
          this[innerItem] = _val = data[innerItem];
        }
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

        /**
         * 如果是数组,深入监听
         */
        if (Array.isArray(value)) {

          /**
           * 如果是对象,继续深入监听
           */
        } else if (typeof value === 'object') {
          let InnerDataClass = deepObjectIn(value, Noop, extendInstance, 2);
          this[innerItem] = _val = new InnerDataClass();

          self.$emit('add-dep', innerItem)

        } else {
          _val = value;
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

        if (Array.isArray(data[i])) {
          let InnerDataClass = deepArrayIn(data[i], root);
          this[i] = _val = new InnerDataClass();
        } else if (typeof data[i] === 'object') {
          let InnerDataClass = deepObjectIn(data[i], Noop, root, 2);
          this[i] = _val = new InnerDataClass();
        } else {
          this[i] = _val = data[i];
        }
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