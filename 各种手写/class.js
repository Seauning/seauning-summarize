class A {
  static a = 'aaa'
  x = 1;  // 实例属性
  #s; // 私有属性
  constructor() {
    this.b = 2  // 实例属性
  }
  static print () { // 静态方法
    console.log('静态属性');
  }
  #func () { // 私有方法
    console.log('私有方法');
  }
  print () {  // 实例方法
    console.log('实例方法');
  }
  get m () { // getter 在 实例.m 时调用

  }
  set m (m) { // setter 在 实例.m = 值 时调用

  }
}
console.log(`A.a==${A.a}`);
// A.prototype.x = 1
class B extends A {
  constructor() {
    super();  // 必须调用
    this.x = 2; // 自己的
    super.x = 3;  // 父亲的
    console.log(super.x);
    console.log(this.x);  // 如果自己没有父亲找
  }
  print () {
    console.log(3);
  }
}
const b = new B()
console.log(B.__proto__, typeof B.__proto__); // [class A] function
console.log(B.prototype.__proto__ === A.prototype, typeof B.prototype.__proto__); // 总是指向父类的prototype
b.print()
B.prototype.__proto__.print()
console.log(B.__proto__ === A);  // true,'子类'的__proto__属性总是指向父类
console.log(b.__proto__.__proto__ === new A().__proto__); // true,'子类实例'的__proto__属性的__proto__属性指向父类实例的__proto__属性
console.log(B.prototype.__proto__);

console.log('------------');

// 构造函数模式
function Person (name, age) {
  this.name = name;
  this.age = age;
  this.sayname = function () {
    console.log(this.name);
  };
  this.sayname = () => {
    console.log(this.name);
  };
}
const p1 = new Person("dz1", 23);
const p2 = new Person("dz2", 24);
let sayname = p1.sayname
sayname()
p2.sayname()
console.log(p1 instanceof Person); // true
p1.sayage = function () {
  console.log(this.age);
}
p1.sayage();

console.log('----------');

// 原型模式
function Person2 (name, age) {
  Person2.prototype.name = name;
  Person2.prototype.age = age;
  Person2.prototype.likes = ["apple", "banana", "watermelon"];
  Person2.prototype.sayname = () => {
    // 这里的箭头函数与构造函数同理
    console.log(this.name);
  };
}
const p21 = new Person2("dz", 23);
const p22 = new Person2("dz1", 24);
p21.likes.pop();
console.log(p21.name === p22.name); // true
console.log(p21.likes); // ['apple', 'banana']
console.log(p22.likes); // ['apple', 'banana']

console.log('----------');

// 组合模式
function Person3 (name, age) {
  this.name = name;
  this.age = age;
}
Person3.prototype.sayname = function () {
  console.log(this.name);
};
const p31 = new Person3("dz", 23);
const p32 = new Person3("dz2", 24);
console.log(p31.name, p32.name);
p31.sayname();
sayname = p32.sayname;
// sayname();
sayname.call(p32);

console.log('----------');

// 动态原型模式
function Person4 (name, age) {
  this.name = name;
  this.age = age;
  // p41 { test: '1' } { test: '1' }
  // p42 { constructor: [Function: Person4], sayname: [Function: sayname] } { constructor: [Function: Person4], sayname: [Function: sayname] }
  console.log(this.__proto__, Person4.prototype);
  // if (typeof this.sayname !== 'function') {
  //   // Person4.prototype.sayname = function () {
  //   //   console.log(this.name);
  //   // }
  //   Person4.prototype.sayname = () => {
  //     console.log(this.name);
  //   }
  // }
  if (typeof this.sayname !== 'function') {
    // 我们知道，在 new 中继承和放到构造函数加工是两个不同的步骤
    // 因此在进入这里之前 p41 就已经继承了修改前原来的原型
    // 但是这里直接修改了 Person4 的原型属性为一个新的引用类型
    // 因此 Person4.prototype 所指向的栈中的地址是一个新的内存的地址
    // 而此时 p41 指向的栈中的内存地址仍然是原来那个地址
    // 所以 p41 就变得孤立不再是 Person4 的实例了
    Person4.prototype = {
      constructor: Person4,
      sayname: function () {
        console.log(this.name);
      }
    }
  }
  // p41 { test: '1' } { constructor: [Function: Person4], sayname: [Function: sayname] }
  // p42 { constructor: [Function: Person4], sayname: [Function: sayname] } { constructor: [Function: Person4], sayname: [Function: sayname] }
  console.log(this.__proto__, Person4.prototype);
}
Person4.prototype.test = '1';
// 这个对象创建时原型上没有 sayname 方法，所以在原型上添加了sayname
// 并且因为 sayname 使用的是箭头函数，所以 this 一直指向为 p41
const p41 = new Person4('dz', 23);
// 这个对象创建时原型上有了 sayname 方法，所以不再在原型上添加
// 因此 p42 使用的 sayname 是在 p41 创建时候添加进去的
// 并且由于使用的是箭头函数所以 this 指向为 p41而非p42
const p42 = new Person4('dz2', 24);
try {
  p41.sayname();
} catch (e) {
  console.log(e.message); // p41.sayname is not a function
}
p42.sayname();  // dz2
