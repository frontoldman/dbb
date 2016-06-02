/**
 * Created by zhangran on 16/6/2.
 */

/**
 * 封装 computed => class, 添加计算属性读取器
 * @param computed computed options
 * @param MY MY Class
 * @returns {Computed} Class extends Data...
 */

export default function(computed, MY) {
  class Computed extends MY{}

  for(let item in computed){
    class ComputedNoop extends Computed{
      constructor(){
        super();
        this[item] = computed[item].call(this);
      }
      get [item]() {
        return this['_' + item];
      }
      set [item](value) {
        this['_' + item] = value;
      }
    }

    Computed = ComputedNoop;
  }

  return Computed;
}