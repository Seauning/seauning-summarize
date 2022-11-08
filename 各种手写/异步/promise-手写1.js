
/**
 * es5写法
 * @param {*} executor */

// 手写 Promise
// 声明构造函数
function Promise (executor) {
  // 声明暴露的属性
  this.PromiseState = 'pending';
  this.PromiseResult = null;
  // 声明不暴露的属性
  // 需要为数组类型，因为一个 promise 对象上的 then 方法可能不止一个
  this.callbacks = []
  // resolve 函数
  const resolve = (data) => { // 这里用了箭头函数, this 总是指向调用方法的对象
    // 判断状态
    if (this.PromiseState !== 'pending') return
    // 1.改变 promise 状态  (promiseState)
    this.PromiseState = 'fullfilled'
    // 2.设置对象结果值     (promiseResult)
    this.PromiseResult = data
    // 在改变状态后调用成功的回调函数
    setTimeout(() => {  // 让执行函数变为异步
      this.callbacks.forEach(callback => {
        callback.onResolved(data)
      })
    })
  }
  // reject 函数
  const reject = (data) => {
    // 判断状态
    if (this.PromiseState !== 'pending') return
    // 1.改变 promise 状态  (promiseState)
    this.PromiseState = 'rejected'
    // 2.设置对象结果值     (promiseResult)
    this.PromiseResult = data
    // 在改变状态后调用成功的回调函数
    setTimeout(() => {  // 让执行函数变为异步
      this.callbacks.forEach(callback => {
        callback.onRejected(data)
      })
    })
  }
  try { // 在调用时捕获异常
    // 同步调用 [执行器函数]
    executor(resolve, reject);
  } catch (e) {
    // 修改 promise 对象状态为失败
    reject(e)
  }
}

/*

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  // 加这两个判断是为了值传递和异常穿透
  if (typeof onResolved !== 'function') {
    onResolved = v => v
  }
  if (typeof onRejected !== 'function') {
    onRejected = e => { throw e }
  }
  return new Promise((resolve, reject) => {
    // 封装函数 
    const callback = (type) => {
      try {
        // 获取回调函数执行结果
        let result = type(this.PromiseResult);
        // 判断
        if (result instanceof Promise) {
          result
            .then(
              v => {
                resolve(v)
              },
              v => {
                reject(v)
              })
        } else {
          // 结果对象状态为[成功]
          resolve(result)
        }
      } catch (e) {
        reject(e)
      }
    }

    // 调用回调函数,同步任务
    if (this.PromiseState === 'fullfilled') {
      // 让执行函数变为异步
      setTimeout(() => {
        callback(onResolved)
      })
    }
    if (this.PromiseState === 'rejected') {
      // 让执行函数变为异步
      setTimeout(() => {
        callback(onRejected)
      })
    }

    // 判断 pending 状态
    // 因为异步任务，状态改变是在 resolve/reject 方法里
    // 即当状态改变就调用 onResolved,onRejected
    if (this.PromiseState === 'pending') {
      // 保存回调函数
      this.callbacks.push({
        onResolved: () => {
          callback(onResolved)
        },
        onRejected: () => {
          callback(onRejected)
        }
      })
    }
  })
}

// 添加 catch 方法
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected)
}

// 添加 resolve 方法
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(
        v => {
          resolve(v)
        },
        e => {
          reject(e)
        }
      )
    } else {
      resolve(value)
    }
  })
}

// 添加 reject 方法
Promise.reject = function (e) {
  return new Promise((resolve, reject) => {
    reject(e)
  })
}

// 添加 all 方法
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    const len = promises.length
    let count = 0
    let results = []
    for (let i = 0; i < len; i++) {
      promises[i].then(
        v => {
          // 得知对象的状态是成功的
          // 所有 promise 对象都成功才调用 resolve
          count++;
          // 将当前 promise 对象成功的结果存入结果数组
          results[i] = v
          // 判断
          // 这个 count 不能由 i 替代,因为每个 then 执行成功的时间不同
          // 如果最后一个 promise 先行成功，也会改变结果
          // 因为如果最后一个 promise 先行成功了,
          // 而前几个 promise 中发生错误,
          // 返回的结果将会是所有成功的 promise(除了失败的)
          // 而不是预期的仅有一个错误的 promise
          if (count === len) {
            // 修改状态
            resolve(results)
          }
        },
        e => {
          reject(e)
        }
      )
    }
  })
}

// 添加 race 方法
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        v => {
          // 谁先改变状态，值由谁决定
          resolve(v)
        },
        e => {
          reject(e)
        }
      )
    }
  })
}
*/


/**
 * es6 写法
 */
class Promise {
  // 构造方法
  constructor(executor) {
    // 声明暴露的属性
    this.PromiseState = 'pending'
    this.PromiseResult = null
    // 声明不暴露的属性
    // 需要为数组类型，因为一个 promise 对象上的 then 方法可能不止一个
    this.callbacks = []
    // resolve 函数
    const resolve = (data) => { // 这里用了箭头函数, this 总是指向调用方法的对象
      // 判断状态
      if (this.PromiseState !== 'pending') return
      // 1.改变 promise 状态  (promiseState)
      this.PromiseState = 'fullfilled'
      // 2.设置对象结果值     (promiseResult)
      this.PromiseResult = data
      // 在改变状态后调用成功的回调函数
      setTimeout(() => {  // 让执行函数变为异步
        this.callbacks.forEach(callback => {
          callback.onResolved(data)
        })
      })
    }
    // reject 函数
    const reject = (data) => {
      // 判断状态
      if (this.PromiseState !== 'pending') return
      // 1.改变 promise 状态  (promiseState)
      this.PromiseState = 'rejected'
      // 2.设置对象结果值     (promiseResult)
      this.PromiseResult = data
      // 在改变状态后调用成功的回调函数
      setTimeout(() => {  // 让执行函数变为异步
        this.callbacks.forEach(callback => {
          callback.onRejected(data)
        })
      })
    }
    try { // 在调用时捕获异常
      // 同步调用 [执行器函数]
      executor(resolve, reject);
    } catch (e) {
      // 修改 promise 对象状态为失败
      reject(e)
    }
  }
  // 添加实例 then 方法
  then (onResolved, onRejected) {
    // 加这两个判断是为了值传递和异常穿透
    if (typeof onResolved !== 'function') {
      onResolved = v => v
    }
    if (typeof onRejected !== 'function') {
      onRejected = e => { throw e }
    }
    return new Promise((resolve, reject) => {
      // 封装函数 
      const callback = (type) => {
        try {
          // 获取回调函数执行结果
          let result = type(this.PromiseResult);
          // 判断
          if (result instanceof Promise) {
            result
              .then(
                v => {
                  resolve(v)
                },
                v => {
                  reject(v)
                })
          } else {
            // 结果对象状态为[成功]
            resolve(result)
          }
        } catch (e) {
          reject(e)
        }
      }

      // 调用回调函数,同步任务
      if (this.PromiseState === 'fullfilled') {
        // 让执行函数变为异步
        setTimeout(() => {
          callback(onResolved)
        })
      }
      if (this.PromiseState === 'rejected') {
        // 让执行函数变为异步
        setTimeout(() => {
          callback(onRejected)
        })
      }

      // 判断 pending 状态
      // 因为异步任务，状态改变是在 resolve/reject 方法里
      // 即当状态改变就调用 onResolved,onRejected
      if (this.PromiseState === 'pending') {
        // 保存回调函数
        this.callbacks.push({
          onResolved: () => {
            callback(onResolved)
          },
          onRejected: () => {
            callback(onRejected)
          }
        })
      }
    })
  }
  // 添加实例 catch 方法
  catch (onRejected) {
    return this.then(undefined, onRejected)
  }
  // 添加 Promise.resolve 方法
  static resolve (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(
          v => {
            resolve(v)
          },
          e => {
            reject(e)
          }
        )
      } else {
        resolve(value)
      }
    })
  }
  // 添加 Promise.reject 方法
  static reject (e) {
    return new Promise((resolve, reject) => {
      reject(e)
    })
  }
  // 添加 Promise.all 方法
  static all (promises) {
    return new Promise((resolve, reject) => {
      const len = promises.length
      let count = 0
      let results = []
      for (let i = 0; i < len; i++) {
        promises[i].then(
          v => {
            // 得知对象的状态是成功的
            // 所有 promise 对象都成功才调用 resolve
            count++;
            // 将当前 promise 对象成功的结果存入结果数组
            results[i] = v
            // 判断
            // 这个 count 不能由 i 替代,因为每个 then 执行成功的时间不同
            // 如果最后一个 promise 先行成功，也会改变结果
            // 因为如果最后一个 promise 先行成功了,
            // 而前几个 promise 中发生错误,
            // 返回的结果将会是所有成功的 promise(除了失败的)
            // 而不是预期的仅有一个错误的 promise
            if (count === len) {
              // 修改状态
              resolve(results)
            }
          },
          e => {
            reject(e)
          }
        )
      }
    })
  }
  // 添加 Promise.allSettled 方法
  static allSettled (promises) {
    return new Promise((resolve, reject) => {
      const len = promises.length
      let results = []
      let counts = 0
      for (let i = 0; i < len; i++) {
        promises[i].then(
          v => {
            results[i] = { status: 'fullfilled', value: v }
            counts++
            if (counts === len) {
              resolve(results)
            }
          },
          (e) => {
            results[i] = { status: 'rejected', reason: e }
            counts++
            if (counts === len) {
              resolve(results)
            }
          })
      }
    })
  }
  // 添加 Promise.race 方法
  static race (promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          v => {
            // 谁先改变状态，值由谁决定
            resolve(v)
          },
          e => {
            reject(e)
          }
        )
      }
    })
  }
}
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.all(promises).
  then((results) => {
    console.log(results)
    // results.forEach((result) => console.log(result.status))
  }, (e) => {
    console.log(e);
  })

Promise.allSettled(promises).
  then((results) => {
    console.log(results)
    results.forEach((result) => console.log(result.status, result.value ? result.value : result.reason))
  });


