// 闭包实现
function SingleInstance (constructor) { // 每执行一次创建一个新的执行上下文
  let instance = null;
  return function () {
    if (instance) return instance;
    instance = new constructor()
    return instance;
  }
}

const Vuex = SingleInstance(function () {
  this.name = 'vuex';
})

let v1 = new Vuex();
let v2 = new Vuex();
console.log(v1.name); // vuex
console.log(v1 === v2); // true

const Vuex2 = SingleInstance(function () {
  this.name = 'vuex2';
})
let v3 = new Vuex2();
console.log(v3.name); // vuex2
console.log(v3 === v2); // true

// 构造函数实现
// function Vuex () {
//   if (typeof Vuex._instance === 'object') return Vuex._instance
//   this.name = 'vuex';
//   Vuex._instance = this;
//   // 隐式返回 this
// }
