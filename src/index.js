/**
 * Created by zhangran on 16/5/31.
 */
import compile from './init/compile'
import initData from './init/data'
import initComputed from './init/computed'


export default function(options) {
  const $el = document.querySelector(options.el);
  const { data, computed } = options;


  const DataClass = initData(data);
  class MY extends DataClass{}

  MY = initComputed(computed, MY);

  return new MY();
}





