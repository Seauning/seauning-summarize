function compose (...funcs) {
  // 函数长度为 0 的处理
  if (funcs.length === 0) return params => params;
  // 函数长度为 1 的处理
  if (funcs.length === 1) return funcs[0];
  return function (params) {
    // return funcs.reduce(function (res, fn) { return fn(res) }, params);
    return funcs.reduce((res, fn) => fn(res), params);
  }
}
const add1 = (x) => x + 1;
const mul3 = (x) => x * 3;
const div2 = (x) => x / 2;
// div2(mul3(add1(add1(0)))); //=>3
let result = compose(add1, add1, mul3, div2)(0)
console.log(result);

let sum = function (a, b, c) {
  return a + b + c
}
let curring = function (fn, ...oldParams) { // 普通函数会变量提升,在这里用let声明
  let params = oldParams
  const fnLength = fn.length;
  const newFunc = function (...newParams) {
    params = [...params, ...newParams]
    if (params.length >= fnLength) { // 执行
      return fn.apply(this, params)
    } else {  // 添加参数
      return newFunc
    }
  }
  return newFunc
}
// sum(1, 2, 3) => sum(1)(2)(3)
let getSum = curring(sum)
console.log(getSum(1)(3)(4));


Array.prototype.reduce = function reduce (fn, init) {
  const arr = this;
  if (arr.length < 1) return;
  const idx = init ? 0 : 1;
  let res = init ? init : arr[0];
  for (let i = idx; i < arr.length; i++) {
    res = fn(res, arr[i])
  }
  return res;
}

sum = function (...args) {
  return args.reduce((sum, item) => sum += item, 0);
}

curring = function (fn, ...oldParams) {
  let params = oldParams
  const newFunc = function (...newParams) {
    params = [...params, ...newParams]
    return newFunc
  }
  newFunc.clear = function () { // 添加一个 clear 方法,执行时情空参数返回函数调用值
    return fn(...params)
  }
  return newFunc
}
getSum = curring(sum)
console.log(getSum(1, 2)(3)(4, 5, 6).clear());

curring = function (fn, ...oldParams) {
  let params = oldParams
  const newFunc = function (...newParams) {
    if (newParams.length === 0) return fn.apply(this, newParams);
    params = [...params, ...newParams]
    return newFunc
  }
  return newFunc
}