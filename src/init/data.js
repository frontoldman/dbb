/**
 * Created by zhangran on 16/6/1.
 */

/**
 * 封装data => class, 添加属性读取器
 * @param vm
 */

export default function(vm) {
  const data = vm._data;
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

  vm.data = new Data();

}