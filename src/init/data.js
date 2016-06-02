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
    let depKey = `${item}-dep`;
    let val;
    class DataNoop extends Data{
      constructor(){
        super();
        this[item] = data[item];
        dep[depKey] = [];
      }

      get [item]() {
        if(dep.now !== null){
          dep[depKey].push(dep.now);
        }
        return val;
      }
      set [item](value) {
        val = value;
      }
    }
    Data = DataNoop;
  }

  return Data
}