const arr = [[1, 2], [3, [4, 6, function a () { }], 4], 2, { a: 1 }]
Array.prototype.flat = function (deep = 1) { // 递归
  const arr = this
  let res = []
  for (let item of arr) {
    if (Array.isArray(item) && deep >= 1) {
      res = [...res, ...item.flat(deep - 1)]  // 调用 flat 的是 item 不是 arr !!!!你个大猪头
    } else {
      res.push(item)
    }
  }
  return res
}
let res = arr.flat(2)
// console.log(res);

Array.prototype.flat = function () {  // reduce
  return this.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? next.flat() : next)
  }, [])
}
console.log(arr.flat());

Array.prototype.flat = function (deep = 1) { // 迭代
  if (!this.length) return this
  let arr = this
  while (arr.some(item => Array.isArray(item)) && deep > 0) {
    // concat 可以传入多个参数
    // 它会把每个参数都当成一个列表然后将列表中每个元素添加到新的数组中
    arr = [].concat(...arr)
    // console.log(arr);
    deep--
  }
  return arr
}
res = arr.flat(2)
console.log(res);

/* res[res.length - 1].a = 2
console.log(arr); // 说明了拷贝的是浅引用
let ob = { c: 3 }
let t = ob
t.c = 2
console.log(ob);// 说明了拷贝的是浅引用 */