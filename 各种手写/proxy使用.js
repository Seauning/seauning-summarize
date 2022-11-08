let onWatch = (obj) => {
  let handler = {
    get (target, property, receiver) {
      console.log(target);
      console.log(property);
      console.log(receiver);
      console.log(`old property '${property}' = ${target[property]}`)
      return Reflect.get(target, property, receiver)
    },
    set (target, property, value, receiver) {
      console.log(`监听到属性${property}改变为${v}`)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = {
  a: 1,
  books: [1, 2, 3]
}
let p = onWatch(
  obj,
)
// p.a = 2 // 监听到属性a改变
// p.a // 'a' = 2
p.books[2] = 1
p.books

