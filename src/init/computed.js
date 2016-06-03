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
  class ComputedClass extends MY{}

  let C1 = getComputedClass(ComputedClass, computed, true);
  let C2 = getComputedClass(C1, computed, false);

  return C2;
}

/**
 * 计算表达式 => Class
 * @param ComputedClass 类
 * @param computed option computed
 * @param addDep 是否注册依赖
 * @returns {*}
 */

function getComputedClass(ComputedClass, computed, addDep){

  for(let item in computed){
    let _val, _deps = [];
    class ComputedNoop extends ComputedClass{
      constructor(){
        super();
        if(addDep){
          dep.now = {
            name: item,
            fn: computed[item]
          };
        }
        this[item] = computed[item].call(this);
        if(addDep){
          dep.now = null;
        }
      }
      get [item]() {
        if(dep.now){
          _deps.push(dep.now)
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

    ComputedClass = ComputedNoop;
  }

  return ComputedClass;
}