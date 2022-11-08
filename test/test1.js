function A () {
  this.foo = 'hello';
}
let obj = null;
if (!global._foo) {
  obj = new A();
}
// export {
//   obj as foo,
// }
// export {
//   A as default
// } 
// export default {
//   foo: obj,
// }
// export default obj
export function area () {
  console.log(1);
}
export function getSum (a, b) {
  console.log(a + b);
}

export default function () {  // 这个含义相当于把后面这个匿名函数赋予 default 这个变量
  return 11;
}
// export default function single () { // 与上面的默认导出等同
//   return 11
// }

export const testObj = {
  d: 2
};