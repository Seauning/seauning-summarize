class _LazyMan {
  name;
  tasks;
  constructor(name) {
    this.tasks = []
    const task = () => {
      console.log(`Hi This is ${name}`);
      this.next();
    }
    this.tasks.push(task);
    // this.next()         // 如果直接调用，链式调用的任务将来不及加入到任务队列中

    // 这里使用一个定时器延时的目的主要是为了让链式调用的所有操作先加入到任务队列中
    // 其主要原理是 setTimeout 是一个异步任务
    // 而将任务加入任务队列的操作是一个同步任务
    // 同步任务将在异步任务执行前先全部执行
    setTimeout(() => {
      this.next();
    }, 0);
  }
  next () {
    const task = this.tasks.shift();
    task && task();
  }
  sleep (time) {  // 将定时任务加入到尾部
    this._sleep(time, false);
    return this;
  }
  sleepFirst (time) { // 将定时任务将入到头部
    this._sleep(time, true);
    return this;
  }
  _sleep (time, first) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`);
        this.next();
      }, time * 1000);
    }
    if (first) { // 该任务需要放在第一个
      this.tasks.unshift(task);
    } else {
      this.tasks.push(task);
    }
  }
  eat (thing) {
    const task = () => {
      console.log(`Eat ${thing}`);
      this.next();
    }
    this.tasks.push(task);
    return this;
  }
};

function LazyMan (name) {
  return new _LazyMan(name);
}

// 实现一个LazyMan，可以按照以下方式调用:
// LazyMan('Hank')
// Hi! This is Hank!

// LazyMan('Hank').sleep(1).eat('dinner')
// Hi! This is Hank!
// //等待10秒..
// Wake up after 10
// Eat dinner~

// LazyMan('Hank').eat('dinner').eat('supper')
// Hi This is Hank!
// Eat dinner~
// Eat supper~

LazyMan('Hank').sleep(5).eat('supper').sleepFirst(1)
//等待5秒
// Wake up after 5
// Hi This is Hank!
// Eat supper

