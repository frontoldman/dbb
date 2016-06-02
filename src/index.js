/**
 * Created by zhangran on 16/5/31.
 */
import compile from './init/compile'
import Event from './event/event'
import initData from './init/data'
import initComputed from './init/computed'
import dep from './init/dep'


export default function(options) {
  const $el = document.querySelector(options.el);
  const { data, computed } = options;

  class MY extends Event{}

  MY = initData(data, MY);
  MY = initComputed(computed, MY);

  const vm = new MY();
  console.log(dep)
  return vm;
}





