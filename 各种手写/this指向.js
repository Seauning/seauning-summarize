Function.prototype._call = function (uThis, ...args) {
  // 获取 this
  let _this = uThis == null ? globalThis : Object(uThis);
  // 方法的唯一键
  const key = Symbol()
  // 将方法挂载到 this
  _this[key] = this
  // 调用,获取返回值
  const res = _this[key](...args)
  // 删除方法键
  Reflect.deleteProperty(_this, key)
  return res
}

Function.prototype._apply = function (uThis, args = []) { // 注意这里的默认值,如果没传入第二个参数会生效
  // 获取 this  
  let _this = uThis == null ? globalThis : Object(uThis);

  function isObject (args) {// 判断是否为对象
    // 注意: typeof null 虽然为 object 但 null 实际并不为对象,具体原因可以百度
    return typeof args === 'object' && args !== null
  }
  function isLikeArray (o) {  // 类数组对象的判断
    if (isObject(o) && Number.isFinite(o.length) && o.length >= 0 && o.length < 4294967296) {
      // 4294967296: 2^32
      return true
    } else {
      return false
    }
  }
  (function () {
    // 传入的第二个参数的处理
    if (isLikeArray(args)) {
      args = Array.from(args) // 转为数组
    }
    else if (isObject(args)) {
      args = []
    }
    else if (!Array.isArray(args)) {
      throw new TypeError('second argument to apply must be an array')
    }
  })(args)
  // const res = this.call(_this, ...args) // 可以通过这样调用减少代码量,就是会多一次获取this的步骤
  const key = Symbol()  // 用于临时存储函数
  _this[key] = this // 隐式绑定函数指向到_this上
  const res = _this[key](...args); // 执行函数并展开数组，传递函数参数
  Reflect.deleteProperty(_this, key)
  return res
}

Function.prototype._bind = function (uThis, ...args) {
  // 拿到方法
  const fn = this
  // 处理this
  uThis = uThis == null ? globalThis : Object(uThis);

  // 包装新方法
  const newFn = function (...newargs) {
    const byNew = this instanceof newFn // this 是否为 newFn 的实例 也就是返回的 newFn 是否通过 new 调用
    const _this = byNew ? this : uThis // new 调用就绑定到 this 上,否则就绑定到传入的 uThis 上
    // 改变 this 指向并调用
    return fn.call(_this, ...args, ...newargs)
  }
  if (fn.prototype) {
    // 复制源函数的 prototype 给 newFn 一些情况下函数没有 prototype ,比如箭头函数
    newFn.prototype = Object.create(fn.prototype);
  }
  return newFn
}

obj = {
  name: '小王',
  age: 18
}

function test (doingSomething, makeSomething) {
  console.log(this);
  console.log(this.name + '  ' + this.age + '  ' + doingSomething + '  ' + makeSomething);
}

function test2 () {
  console.log(this);
  console.log(arguments);
}

function student (name, age) {
  this.name = name
  this.age = age
}

// test2._call({})
// test2.call({})
// test2._call(null, '')
// test2.call(null, '')
// test2._call(obj, 'eating')
// test2.call(obj, 'eating')

/**
 * 使用 apply 传入的第二个参数需要为数组
 * 但存在几种特殊的的参数情况：
 * 1、{}
 *  对象有内容、无内容都可,通过 new 得到的也可
 * 2、undefined
 * 3、null
 * 注意点:有一些特殊情况会发生值的转变
 *        传入参数          apply处理                 调用函数中
 *    1.{length:2} =>  [undefined,undefined] => [Arguments]{'0':undefined,length；1}
 *    2.undefined =>        []               => [Arguments]{}
 *    3.null =>             []               => [Arguments]{}
 *    4.new String('abc') => ['a','b','c']   => [Arguments]{ '0': 'a', '1': 'd', '2': 'v' }
 *    5.new Number、Set、Map => []           => [Arguments]{}
 * 总结:
 *    1.类似数组的对象(一些通过 new 得到的对象加了 length 属性就属于类似数组的对象)、通过 new String() 得到的对象都会做转换
 *    2.只要是对象一律可以当做传入的参数(通过 new 得到的也一样),一律转为空数组
 *    3.undefined、null一律转为空数组
 */
//  test1._apply(obj) // [Arguments] {}
//  test1.apply(obj)// [Arguments] {}
// test2._apply(null) // [Arguments] {}
// test2.apply(null)// [Arguments] {}
// test2._apply(obj, { a: 1 })// [Arguments] {}
// test2.apply(obj, { a: 1 })// [Arguments] {}
// test2._apply(1, { a: 1 })// [Arguments] {}
// test2.apply(1, { a: 1 })// [Arguments] {}
//  test2._apply(obj, { length: 2 }) // [Arguments] { '0': undefined, '1': undefined }
//  test2.apply(obj, { length: 2 }) // [Arguments] { '0': undefined, '1': undefined }
//  test._apply(obj, '') // throw new TypeError('second argument to apply must be an array')
//  test.apply(obj, '') // TypeError: second argument to apply must be an array
//  test._apply(obj, 1) // throw new TypeError('second argument to apply must be an array')
//  test.apply(obj, 1) // throw new TypeError('second argument to apply must be an array')
//  test._apply(obj, []) // { name: '小王', age: 18, [Symbol()]: [Function: test] },小王  18  undefined  undefined
//  test.apply(obj, []) // { name: '小王', age: 18 },小王  18  undefined  undefined
//  test._apply(obj, ['Eating']) // { name: '小王', age: 18, [Symbol()]: [Function: test] },小王  18  Eating  undefined
//  test.apply(obj, ['Eating']) // { name: '小王', age: 18 },小王  18  Eating  undefined

// test2._bind()()
// test2.bind()()
// test2._bind(null, 'eating')('make rice')
// test2.bind(null, 'eating')('make rice')
// console.log(new (student._bind(obj))('小王', 100));
// console.log(new (student.bind(obj))('小王', 18));