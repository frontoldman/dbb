/**
 * Created by zhangran on 16/6/2.
 */

/**
 * 依赖列表
 */

export default {
  now: null,

  /**
   * 触发依赖列表
   * @param deps 依赖列表
   */

  emitDeps: function(deps) {
    let computedObj;
    for(let i = 0, l = deps.length;i<l;i++){
      computedObj = deps[i];
      this[computedObj.name] = computedObj.fn.call(this)
    }
  }
}