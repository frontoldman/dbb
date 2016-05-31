(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.MY = factory());
}(this, function () { 'use strict';

  /**
   * Created by zhangran on 16/5/31.
   */

  var x = 1;

  function index () {
    x++;
    console.log(foo);
  }

  return index;

}));