/**
 * 串行
 */

class PriorityQueue {
  tasks;
  constructor(tasks) {
    this.tasks = tasks || [];
    this.sort()
  }

  sort () {
    this.tasks = this.tasks.sort((t1, t2) => t1.priority - t2.priority);
  }

  push (task) {
    this.tasks.push(task);
    this.sort()
  }

  run () {
    // 1. 利用 setTimeout 将所有的任务加入队列
    setTimeout(() => {
      this.execute()
    }, 200)
  }

  async execute () {
    const tast = this.tasks.shift();

    await tast.callback()

    // 2. 执行完当前任务判断是否有下一任务
    if (this.tasks.length) {
      this.execute()
    }
  }
}

const getPromise = (callback, timer = 200) => {
  return new Promise((res) => {
    setTimeout(() => {
      callback()
      res()
    }, timer)
  })
}

const queue = new PriorityQueue([
  {
    priority: 6,
    callback: async () => await getPromise(() => console.log(6), 1000)
  },
  {
    priority: 2,
    callback: async () => await getPromise(() => {
      console.log(2)

      queue.push({
        priority: 5,
        callback: async () => await getPromise(() => console.log(5), 1000)
      },)
    }, 1000)
  },
  {
    priority: 4,
    callback: async () => await getPromise(() => console.log(4), 1000)
  },
])

queue.run()

queue.push({
  priority: 1,
  callback: async () => await getPromise(() => console.log(1), 1000)
},)

queue.push({
  priority: 3,
  callback: async () => await getPromise(() => console.log(3), 1000)
},)