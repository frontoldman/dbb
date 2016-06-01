/**
 * Created by zhangran on 16/5/31.
 */
import compile from './init/compile'


export default class MY {
  constructor(options) {
    this._$el = document.querySelector(options.el);
    this._data = options.data;

    this.compile();
  }
  get $el() {
    return this._$el;
  }
  get data() {
    return this._data;
  }
  compile() {
    compile(this);
  }

}



