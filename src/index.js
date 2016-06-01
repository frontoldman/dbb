/**
 * Created by zhangran on 16/5/31.
 */
import compile from './init/compile'
import data from './init/data'


export default class MY {
  constructor(options) {
    this._$el = document.querySelector(options.el);
    this._data = options.data;

    compile(this);
    data(this);

  }
  get $el() {
    return this._$el;
  }
  get data() {
    return this._data;
  }

}



