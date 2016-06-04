/**
 * Created by zhangran on 16/6/1.
 */

import dep from "./dep";

/**
 * 封装data => class, 添加属性读取器
 * @param data
 * @param MY class
 * @returns {Data} 类 Data
 */

export default function (data, MY) {
  return deepObjectIn(data, MY, 1)
}


/**
 * 判断data值是否是对象, 是的话首先观察
 * @param data
 * @param root
 * @param type : 1 MY | 2 : deepObj
 * @returns {InnerData}
 */

function deepObjectIn(data, extendsClass, type) {
  class InnerData {
  }
  let extendInstance
  if (type === 1) {
    class InnerData extends extendsClass {
    }
  } else if (type === 2) {
    class InnerData {
    }
  }

  for (let innerItem in data) {
    let _val, _deps = [];
    class InnerDataNoop extends InnerData {
      constructor() {
        super()

        if (type === 1) {
          extendInstance = this;
        } else {
          extendInstance = extendsClass;
        }

        if (Array.isArray(data[innerItem])) {

        } else if (typeof data[innerItem] === 'object') {
          let InnerDataClass = deepObjectIn(data[innerItem], extendInstance, 2);
          this[innerItem] = new InnerDataClass();
        } else {
          this[innerItem] = data[innerItem];
        }
      }

      get [innerItem]() {

        console.log(innerItem)

        if (dep.now !== null) {
          _deps.push(dep.now);
        }

        return _val;
      }

      set [innerItem](value) {

        if (value === _val) {
          return;
        }

        _val = value;

        let self;
        if (type === 1) {
          self = this;
        } else if (type === 2) {
          self = extendInstance;
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
 * @param item
 * @param root
 */

function deepArrayIn(data, item, root) {
  class InnerData {
  }

  for (let i = 0, l = data.length; i < l; i++) {
    let _val, _deps = [];

    class InnerDataNoop extends InnerData {
      constructor() {
        super()
      }

    }
  }

  return InnerData;
}