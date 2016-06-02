/**
 * Created by zhangran on 16/6/1.
 */

/**
 * 封装data => class, 添加属性读取器
 * @param data
 * @returns {Data} 类 Data
 */

export default function(data) {
  class Data{}

  for(let item in data){
    class DataNoop extends Data{
      constructor(){
        super();
        this[item] = data[item];
      }
      get [item]() {
        return this['_' + item];
      }
      set [item](value) {
        this['_' + item] = value;
      }
    }
    Data = DataNoop;
  }

  return Data
}