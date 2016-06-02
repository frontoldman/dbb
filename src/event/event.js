/**
 * Created by zhangran on 16/6/2.
 */
import { slice } from '../utils'

/**
 * event 精简版的事件系统
 *
 * https://github.com/vuejs/vue/blob/dev/src/instance/api/events.js
 */

export default class Event{
  constructor() {
    this._events = {};
  }

  /**
   * 添加事件
   * @param event
   * @param fn
   */
  $on(event, fn) {
    (this._events[event] || (this._events[event] = [])).push(fn)
  }

  /**
   * 移除事件
   * @param event
   * @param fn
   */
  $off(event, fn) {
    if(arguments.length){
      this._events = {};
      return;
    }

    let cbs = this._events[event]
    if (!cbs) {
      return this
    }

    if (arguments.length === 1) {
      this._events[event] = null
      return this
    }

    let cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i]
      if (cb === fn) {
        cbs.splice(i, 1)
        break
      }
    }
  }

  /**
   * 触发事件
   * @param event
   */
  $emit(event) {
    let cbs = this._events[event];
    let args = slice(arguments, 1)
    if(cbs){
      for (let i = 0, l = cbs.length; i < l; i++) {
        let cb = cbs[i];
        cb.apply(this, args);
      }
    }
  }
}