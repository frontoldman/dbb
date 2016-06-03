/**
 * Created by zhangran on 16/6/1.
 */

/**
 * 转换类数组对象为数组
 * @param arrryLike
 * @returns {Array.<*>}
 */

export function slice(arrryLike, start = 0) {
  return [].slice.call(arrryLike, start)
}


export function extend() {

}