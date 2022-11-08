/* 实现一个并发限制的异步调度器 */
class Scheduler {
  queue;
  maxCount;
  runCounts;

  constructor(limit) {
    this.queue = [];
    this.maxCount = limit;
    this.runCounts = 0;
  }

  add (time, order, asyncEvent) {
    let promiseCreator;
    if (asyncEvent) {
      promiseCreator = asyncEvent;
    } else {
      promiseCreator = function () {
        return new Promise((resolve, reject) => {
          setTimeout(() => {  // 让其变为一个异步事件(注:如果题目传入的事件已经是异步的就无须这个了)
            console.log(order);
            resolve();
          }, time);
        });
      };
    }

    this.queue.push(promiseCreator)
    if (this.runCounts < this.maxCount) {
      this.request();
    }
  }

  request () {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;
    // 拿出第一个任务异步执行
    this.queue.shift()().then((res) => {
      this.runCounts--;
      this.request()  // 执行下一个异步任务
    });
  }

}
const scheduler = new Scheduler(2);
const addTask = (time, order) => {
  scheduler.add(time, order)
}
addTask(2000, "1")
addTask(1000, "2")
addTask(3000, "3")

function readFile () {
  const promise1 = new Promise((resolve) => {
    setTimeout(() => {
      resolve('text')
    }, 2000)
  })
  return promise1.then((res) => {
    console.log(`single ${res}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(res.repeat(2))
      }, 1000);
    })
  }).then(res => {
    console.log(`double ${res}`);
  })
}
scheduler.add(1, 1, readFile)

addTask(1000, "4")
