Object.defineProperty(Object, 'is', {
  value: is,
  configurable: true,
  enumerable: false,
  writable: true,
})
function is (x, y) {
  if (x === y) {
    // 针对于 +0 != -0 的情况
    // 1. x !== 0 是为了排出其他数值
    // 2. 1/0 = Infinity, 1/-0 = -Infinity  
    // 3. Infinity != -Infinity
    return x !== 0 || 1 / x === 1 / y;
  }
  // 针对于 NaN 的情况
  // NaN != NaN && NaN != NaN
  return x !== x && y !== y;
}
console.log(Object.is(NaN, NaN));
console.log(Object.is(0, +0));
console.log(Object.is(-0, +0));

function freeze (obj) {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError(`The ${obj} is not object`);
  }
  for (let key of Object.keys(obj)) {
    Object.defineProperty(obj, key, {
      writable: false,
      configurable: false,
    })
  }
  Object.preventExtensions(obj);
  return obj;
}

const o = { name: 'z', fn: function () { }, a: { c: 1 } };
Object.freeze(o);
// freeze(o);
// // o.name = 'g';
// // o.fn = 1;
// // o.o = 1;
// freeze 是浅冻结的，因此对于对象深层的属性是可修改的
o.a.c = 3;
// freeze 会调用 preventExtensions ，这个静态方法会把对象的原型变为不可扩展
o.__proto__.a = {}
// console.log(o.name === 'z' && typeof o.fn === 'function' && o.o === undefined);