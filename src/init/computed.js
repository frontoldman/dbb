/**
 * Created by zhangran on 16/6/2.
 */

import dep from './dep'

/**
 * 封装 computed => class, 添加计算属性读取器
 * @param computed computed options
 * @param MY MY Class
 * @returns {Computed} Class extends Data...
 */

export default function(computed, MY) {
  class Computed extends MY{}

  for(let item in computed){
    let val;
    class ComputedNoop extends Computed{
      constructor(){
        super();
        dep.now = item;
        this[item] = computed[item].call(this);
        dep.now = null;
      }
      get [item]() {
        return val;
      }
      set [item](value) {
        val = value;
      }
    }

    Computed = ComputedNoop;
  }

  return Computed;
}