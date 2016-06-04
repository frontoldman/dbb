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

        } else if (typeof data[innerItem] === 'object') {
          let InnerDataClass = deepObjectIn(data[innerItem], Noop, extendInstance, 2);
          this[innerItem] = _val = new InnerDataClass();
        } else {
          this[innerItem] = _val = data[innerItem];
        }
      }

      get [innerItem]() {

        if (dep.now !== null) {

          var hasSame;
          for(let i = 0,l = _deps.length;i<l;i++){
            if(_deps[i].name === dep.now.name){
              hasSame = true;
              break;
            }
          }
          
          if(!hasSame){
            _deps.push(dep.now);
          }
        }

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

        console.log(_deps);

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