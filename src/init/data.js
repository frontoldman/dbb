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
        this[item] = data[item];
      }
      get [item]() {
        if(dep.now !== null){
          _deps.push(dep.now);
        }
        return _val;
      }
      set [item](value) {
        _val = value;

        let computedObj;
        for(let i = 0, l = _deps.length;i<l;i++){
          computedObj = _deps[i];
          this[computedObj.name] = computedObj.fn.call(this)
        }
      }
    }
    Data = DataNoop;
  }

  return Data
}