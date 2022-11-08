function debounce (fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(this, args); // 改变this指向为调用 debounce 所指的对象
    }, delay)
  }
}

function throttle (fn, delay, immediate = false) { // 时间戳版
  let preTime = 0;
  return function (...args) {
    let nowTime = +new Date();
    if (immediate) {
      fn.apply(this, args);
      immediate = false;
      preTime = nowTime; // 更新对比时间
      return;
    }
    if (nowTime - preTime >= delay) { // 过了规定的延迟才允许调用
      preTime = nowTime; // 更新对比时间
      return fn.apply(this, args);
    }
  }
}

function throttle (fn, delay) { // 定时器 版
  let timer;
  return function(...args) {
    if (timer) return;
    timer = setTimeout(() => {  // 使用了箭头函数，this指向外层的this
      fn.apply(this, args);
      timer = null;
    }, delay)
  }
}
