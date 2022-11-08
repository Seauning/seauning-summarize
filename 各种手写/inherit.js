/* 原型链继承 */
function Parent (name) {
  this.name = this.name
  this.say = function () {
    console.log(`原型链 my name is ${this.name}`);
  }
}

Parent.prototype.age = 18
Parent.prototype.play = function () {
  console.log(`原型链 ${this.name} love play`);
}

function Child (name) {
  Parent.call(this) // 继承父类的构造函数里面的属性方法
  this.name = name
}


/* create 实现 */
function create (prototype) {
  if (!(prototype instanceof Object)) {
    throw new TypeError('TypeError')
  }
  function F () { };
  F.prototype = prototype;
  return myNew(F);
}


/* new 实现 */
function myNew (fn, ...args) {
  if (typeof fn !== 'function') { // 参数校验
    console.error(`${fn} is not a constructor`);
    return;
  }

  // 创建一个继承了 fn 这个构造函数原型的对象
  // obj.__proto__ = fn.prototype
  const obj = new Object();
  // console.log(`设置原型前`, obj.constructor);
  Object.setPrototypeOf(obj, fn.prototype);

  console.log(`new 中加工前`, obj); // 加工前
  // 第一步：将继承后的对象传入构造函数进行加工,将实例属性加工到 obj 上
  // 第二步：如果构造函数有返回值优先使用返回值
  let res = fn.call(obj, ...args);
  console.log(`new 中加工后`, obj); // 加工后

  if (res && (typeof res === "object" || typeof res === "function")) {  // 有返回值并且返回值是函数或对象,返回这个返回值
    return res;
  }
  return obj; // 否则返回继承的对象
}

// 让子类的原型指向一个由父类创建出的对象,继承父类原型的属性和方法
// Child.prototype = Object.create(Parent.prototype)
Child.prototype = create(Parent.prototype)
console.log(Parent.prototype.constructor === Child.prototype.constructor);

console.log(`Constructor ${Child.prototype.constructor}`); // 继承前
// 让子类的构造函数重新指回子类构造函数(上一步覆盖了)
Child.prototype.constructor = Child
console.log(`Constructor ${Child.prototype.constructor}`); // 继承后

let child = myNew(Child, 'xioaming')
child.say()   // 父类构造函数中的方法
console.log(`原型链 ${child.age}`);
child.play()  // 父类原型中的方法



function Person (name, age) {
  this.name = name;
  this.age = age;

  // return {
  //   name: 'wongming',
  //   age: 99,
  //   say () {
  //     console.log(this.age);
  //   }
  // }

  // return function () {
  //   console.log(1);
  // }
}

// Person.prototype.say = function () {
//   console.log(this.age);
// };
let p1 = myNew(Person, "lihua", 18);
// p1 = new Person("lihua", 18);
console.log(`new ${p1.name}`);
console.log(`new `, p1);
// p1.say();  // 构造函数返回值是对象
// p1() // 构造函数返回值是函数

function myInstanceof (left, right) {
  if (typeof right == null) 
    throw new Error('右值不为对象')
  // 如果不是对象就直接返回 false，并且左值为 undefined/null 也返回 false
  if (typeof left !== 'object' || left == null) return false;
  // 获取对象的隐式原型属性的值
  let proto = Object.getPrototypeOf(left);
  // 获取构造函数的 prototype 对象(显示原型属性的值)
  const prototype = right.prototype
  while (true) {
    if (!proto) { // 原型链的终点是 null
      return false;
    }
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
}

console.log(`instanceof ${myInstanceof(p1, Object)}`);
console.log(`instanceof ${myInstanceof(null, Object)}`);