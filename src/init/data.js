/**
 * Created by zhangran on 16/6/1.
 */

import dep from './dep'

/**
 * 封装data => class, 添加属性读取器
 * @param data
 * @param MY class
 * @returns {Data} 类 Data
 */

export default function(data,MY) {
  class Data extends MY{}

  for(let item in data){
    let _val, _deps = [];

    class DataNoop extends Data{
      constructor(){
        super();

        if(typeof data[item] === 'object'){
          const InnerDataClass = deepObjectIn(data, item, this);
          this[item] = new InnerDataClass();
        }else{
          this[item] = data[item];
        }
      }
      get [item]() {
        if(dep.now !== null){
          _deps.push(dep.now);
        }
        return _val;
      }
      set [item](value) {
        if(value === _val){
          return;
        }
        _val = value;

        dep.emitDeps.call(this, _deps)
      }
    }



    Data = DataNoop;
  }

  return Data
}


/**
 * 判断data值是否是对象或者数组, 是的话首先观察
 * @param data
 * @param item
 * @param root
 * @returns {InnerData}
 */

function deepObjectIn(data, item, root){
  class InnerData{};

  for(let innerItem in data[item]){
    let _val, _deps = [];
    class InnerDataNoop extends InnerData{
      constructor() {
        super()
        if(typeof data[item][innerItem] === 'object'){
          let InnerDataClass = deepObjectIn(data[item], innerItem, root);
          this[innerItem] = new InnerDataClass();
        }else{
          this[innerItem] = data[item][innerItem];
        }
      }
      get [innerItem]() {

        if(dep.now !== null){
          _deps.push(dep.now);
        }
        return _val;
      }
      set [innerItem](value) {

        if(value === _val){
          return;
        }
        _val = value;
        dep.emitDeps.call(root, _deps)
      }
    }

    InnerData = InnerDataNoop;
  }

  return InnerData;
}