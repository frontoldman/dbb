/**
 * Created by zhangran on 16/5/31.
 */
import Event from "./event/event";
import initData from "./init/data";
import initComputed from "./init/computed";


export default function (options) {
  const $el = document.querySelector(options.el);
  const {data, computed} = options;

  class MY extends Event {
  }

  MY = initData(data, MY);
  MY = initComputed(computed, MY);

  const vm = new MY();
  return vm;
}





