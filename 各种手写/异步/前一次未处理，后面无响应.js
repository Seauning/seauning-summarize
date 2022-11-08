// // 1. async/await
function singlePipe (promiseFn) {
  // TODO
  let flag = false; // 互斥信号量，标记前一次是否执行完
  return async function (arg) {
    if (flag) return; // 还有任务在执行
    flag = true;
    const res = await promiseFn(arg);       // 两种都可以
    return res;
  }
}

// 2. promise.then
function singlePipe (promiseFn) {
  // TODO
  let flag = false; // 互斥信号量，标记前一次是否执行完
  return function (arg) {
    if (flag) return Promise.resolve(null); // 还有任务在执行
    flag = true;
    const res = promiseFn(arg).then((arg) => {
      flag = false;
      return arg;
    });
    return res;
  }
}

// 模拟一次请求
function bar (data) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(data), 1000);
  });
}

const request = singlePipe(bar);

request(1).then(res => console.log(res)); // 1

request(2).then(res => console.log(res)); // 无响应

setTimeout(() => {
  request(3).then(res => console.log(res)); // 3
}, 1002);