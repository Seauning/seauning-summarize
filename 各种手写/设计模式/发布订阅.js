class EventEmitter {
  #events;
  constructor() {
    this.#events = new Map()
  }
  on (type, event) {
    if (!this.#events.has(type)) {
      this.#events.set(type, [event])  // 第一次 生成数组
    } else {
      this.#events.get(type).push(event) // 第二次直接 push
    }
  }
  off (type, event) {
    if (!this.#events.get(type)) return false;  // 如果没有这个类型
    let events = this.#events.get(type)  // 拿到这个类型的所有事件
    const idx = events.indexOf(event) // 找到删除的事件下标
    if (idx === -1) return false  // 如果事件不存在(!!!!!!)
    events.splice(idx, 1) // 删除
    if (events.length === 0) { // 如果没事件了将该类型置空(!!!!!!)
      this.#events.delete(type)
    }
    return true
  }
  once (type, event) { // 加入只执行一次的事件
    const fn = () => {
      // 包装一下该事件,注意需要修改this指向,这样 fn 的 this就一直是once的this了(!!!!!!)
      // 也可以使用 fn.bind(this) 来改变 fn 的 this 指向
      event();
      this.off(type, fn);
    }
    this.on(type, fn)
    // function fn() {
    //   event();
    //   this.off(type, fn)
    // }
    // this.on(type, fn.bind(this))
  }
  emit (type, ...rest) { // 触发事件
    const events = this.#events.get(type)
    for (let event of events) {
      // 并且 event 内部可能会通过 this 获取属性
      // 如果直接用普通函数调用的话 this 是 undefined/window/global
      event.call(this, ...rest)
    }
  }
  removeAllListeners (type) { // 移除一个类型的事件或所有事件
    if (type) { // 移除该类型事件
      this.#events.has(type) && this.#events.delete(type);
    } else {  // 没有传参移除所有事件
      this.#events.clear();
    }
  }
}
const event = new EventEmitter()

function print () {
  console.log('print!!!');
}
// event.on('test', print)
// event.on('test', print)
// event.off('test', print)
// event.off('test', print)
event.once('test', print)
event.emit('test')

function getSum (...rest) {
  console.log(rest.reduce((sum, item) => sum += item, 0));
}
function getMul (...rest) {
  console.log(rest.map((item) => item * item));
}
event.on('params', getSum)
event.on('params', getMul)
event.emit('params', ...[1, 2, 3])

function myInfo () {
  console.log(this.info);
}

event.on('info', myInfo);
event.info = {
  a: 1
}
event.emit('info')