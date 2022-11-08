
// 5. 可能的状态
const PENDING = 'pending';
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';

class MyPromise {

  // 5. 存储状态，初始值为 pending
  status = PENDING;
  // 5. 状态变为成功后的值
  value = null;
  // 5. 状态变为失败后的原因
  reason = null;

  // 10. 成功回调函数
  // onFufilledCallback = null;
  // 10. 失败回调函数
  // onRejectedCallback = null;

  // 13. 成功回调函数数组
  onFufilledCallbacks = [];
  // 13. 失败回调函数数组
  onRejectedCallbacks = [];


  /**
   * 1. executor 是一个执行器，进入会立即执行
   * @param {*} executor 
   */
  constructor(executor) {
    // 21. 捕获错误
    try {
      // 2. 执行的同时传入 resolve 和 reject 两个方法
      executor(this.resolve, this.reject);
    } catch (err) {
      // 22. 如果有错误，直接 reject
      this.reject(err);
    }
  }

  /**
   * 3. resolve 和 reject 采用箭头函数的形式
   * 如果是普通函数，直接调用的话，它的 this 指向为 undefined/window/global
   * 用箭头函数可以让 this 永远指向当前实例对象
   */

  // 4. 更改状态为成功状态
  resolve = (value) => {
    // 6. 状态是等待状态才执行状态修改操作
    if (this.status === PENDING) {
      // 7.修改状态，保存值
      this.status = FULLFILLED;
      this.value = value;

      // 12. 判断成功回调函数是否存在，如果存在就调用
      // this.onFufilledCallback && this.onFufilledCallback(value);

      // 15. 调用所有成功回调函数
      this.onFufilledCallbacks.forEach((cb) => cb());
      this.onFufilledCallbacks.length = 0;
    }
  }

  // 4. 更改状态为失败状态
  reject = (reason) => {
    // 6. 状态是等待状态才执行状态修改操作
    if (this.status === PENDING) {
      // 7.修改状态，保存值
      this.status = REJECTED;
      this.reason = reason;

      // 12. 判断失败回调函数是否存在，如果存在就调用
      // this.onRejectedCallback && this.onRejectedCallback(reason);
      // 15. 调用所有失败回调函数

      this.onRejectedCallbacks.forEach((cb) => cb());
      this.onRejectedCallbacks.length = 0;
    }
  }

  /**
   * 成功的回调函数、失败的回调函数
   * @param {*} onFullfilled 
   * @param {*} onRejected 
   */
  then (onFullfilled, onRejected) {
    // 26. 使用默认函数
    onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : e => {
      throw e
    };

    // 16. 为了实现链式调用需要返回一个 Promise 对象
    const promise = new MyPromise((resolve, reject) => {
      // 8. 判断promise对象状态
      if (this.status === FULLFILLED) {

        // 20. 创建一个微任务等待 promise 完成初始化
        queueMicrotask(() => {
          // 23. 捕获 then 执行时的错误
          try {
            // 17. 获取成功回调函数执行结果
            // 9. 调用成功回调，传入结果
            const result = onFullfilled(this.value);

            // 18. 传入 resolvePromise 集中处理
            // 其实就是借助这个函数判断 onFullfilled 的返回值是不是一个 thenable 对象
            // 是的话再次调用 then 方法，不是直接 resolve/reject(返回值)
            // resolvePromise(result, resolve, reject);

            // 19.将 then 方法要返回的 promise 传入用于判断与 result 是否为同一个
            // 如果不是，将成功回调也就是 then 里的回调更改为异步调用
            // 此时的 promise 并未初始化
            resolvePromise(promise, result, resolve, reject);
          } catch (err) {
            // 24. then 执行时出现错误直接调用 reject
            // 这里其实有一个细节很多人没有注意到(其实是自己犯蠢了)
            // 就是这个 reject 不能通过 this 调用
            // 如果通过 this 调用的话使用的就是 this 上的 reject 函数了
            // 而不是 new MyPromise 时传入的 reject
            // 它要改变的是当前 then 方法返回的 Promise 对象的状态
            reject(err);
          }

        })

      } else if (this.status === REJECTED) {
        // 25. 补充 reject
        queueMicrotask(() => {
          try {
            // 9. 调用失败回调，传入原因
            const result = onRejected(this.reason);
            resolvePromise(promise, result, resolve, reject);
          } catch (err) {
            console.log('top');
            reject(err);
          }
        })
      } else {
        // 11. 不清楚异步任务结果，需要存储回调函数
        // 等到异步任务结束再调用
        // this.onFufilledCallback = onFullfilled;
        // this.onRejectedCallback = onRejected;

        // 26. 补充 pending，包装回调函数将其变为微任务，捕获 then 执行时的错误
        // 14. 添加多个回调函数
        this.onFufilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const result = onFullfilled(this.value);

              resolvePromise(promise, result, resolve, reject);
            } catch (err) {
              reject(err);
            }
          })
        });
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const result = onRejected(this.reason);
              resolvePromise(promise, result, resolve, reject);
            } catch (err) {
              reject(err)
            }
          })
        });
      }
    })
    return promise;
  }

  catch (onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * callback 一定会执行
   */
  finally (callback) {
    return this
      .then(
        value => MyPromise.resolve(callback()).then(() => { return value }),
        reason => MyPromise.resolve(callback()).then(() => { throw reason })
      )
  }

  static resolve (value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve, reject) => {
      if (typeof value === 'object' && value !== null) {
        const then = value.then;
        if (!then) resolve(value)

        // queueMicrotask(() => {
        try {
          // 如果传入的参数是一个 thenable 对象
          // 调用 thenable 对象的 then 方法
          then.call(value, resolve, reject);
        } catch (err) {
          reject(err)
        }
        // })
      } else {
        resolve(value);
      }
    })
  }

  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    })
  }

  /**
   * Promise.all 传入的参数必须具有 iterator 接口
   * @param {*} promise 
   */
  static all (promises) {
    if (typeof promises[Symbol.iterator] !== 'function') {
      throw new TypeError('Object should be have Symbol.iterator');
    };
    return new MyPromise((resolve, reject) => {
      let counts = 0, len = promises.length;
      let res = [];
      for (let i = 0; i < len; i++) {
        MyPromise.resolve(promises[i])
          .then((value) => {
            res[i] = value
            counts++;
            if (counts === len) {
              resolve(res);
            }
          }, reject)
      }
    })
  }

  /**
   * Promise.race 传入的参数必须具有 iterator 接口
   * @param {*} promises 
   * @returns 
   */
  static race (promises) {
    if (typeof promises[Symbol.iterator] !== 'function') {
      throw new TypeError('Promises should be hava Symbol.iterator');
    };
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i])
          .then(resolve, reject);
      }
    })
  }

  /**
   * Promise.any 传入的参数必须具有 iterator 接口
   * @param {*} promises 
   */
  static any (promises) {
    if (typeof promises[Symbol.iterator] !== 'function') {
      throw new TypeError('Promises should be hava Symbol.iterator');
    };
    const res = [];
    let counts = 0;
    return new Promise((resolve, reject) => {
      for (let promise of promises) {
        MyPromise.resolve(promise).then(resolve, e => {
          res[i] = { status: 'rejected', value: e };
          counts++;
          if (counts === promises.length) {
            reject(new Error('No promise is resolved'))
          }
        })
      }
    })
  }

  /**
   * Promise.allSettled 传入的参数必须具有 iterator 接口
   * @param {*} promises 
   * @returns 
   */
  static allSettled (promises) {
    if (typeof promises[Symbol.iterator] !== 'function') {
      throw new TypeError('Object should be have Symbol.iterator');
    };
    return new MyPromise((resolve) => {
      let counts = 0, len = promises.length;
      let res = [];
      for (let i = 0; i < len; i++) {
        MyPromise.resolve(promises[i])
          .then((value) => {
            res[i] = {
              value,
              status: 'fullfilled'
            };
            counts++;
            if (counts === len) {
              resolve(res);
            }
          }, (reason) => {
            res[i] = {
              reason,
              status: 'rejected'
            };
            counts++;
            if (counts === len) {
              resolve(res);
            }
          })
      }
    })
  }
}

// 1-9 √
/*
let promise1 = new MyPromise((resolve, reject) => {
  resolve('success');
  reject('reject');
})

promise1.then(value => {
  console.log(value);
}, reason => {
  console.log(reason);
})
*/

// 10-12 √
// 原因：setTimeout 是异步代码, then 会马上执行没有等到异步任务执行结束
// 此时状态为 pending
/*
let promise2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('failed');
  }, 1000);
})

promise2.then(v => {
  console.log(v);
}, res => {
  console.log(res);
})
*/

// 实现：then 方法多次调用添加多个处理函数
// 13-15 √
/*
let promise3 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
})

promise3.then((v) => {
  console.log(1);
  console.log(v);
})

promise3.then((v) => {
  console.log(2);
  console.log(v);
})

promise3.then((v) => {
  console.log(3);
  console.log(v);
})
*/

// 实现：then 方法实现同步任务链式调用
// 16-18 √
// 借助这个函数用于判断返回的结果是不是一个 Promise 对象
/*
function resolvePromise (result, resolve, reject) {
  // 判断 result 是不是 MyPromise 实例对象
  if (result instanceof MyPromise) {
    // 执行 result，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // result.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    result.then(resolve, reject)
  } else {
    // 普通值
    resolve(result)
  }
}

let promise4 = new MyPromise((resolve, rejected) => {
  resolve('first')
})

promise4.then((v) => {
  console.log(1);
  console.log(v);
  return new MyPromise((resolve, reject) => {
    resolve('second')
  })
}).then(v => {
  console.log(2);
  console.log(v);
})
*/

// 实现：then 方法链式调用识别 Promise 是否返回自己
// 如果 then 方法返回的是自己的 Promise 对象，则会发生循环调用，这个时候程序会报错
// 19-20 √
/*
function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if (result instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    result.then(resolve, reject)
  } else {
    // 普通值
    resolve(result)
  }
}

let promise51 = new MyPromise((resolve, rejected) => {
  resolve('first')
})

let promise52 = promise51.then((v) => {
  console.log(1);
  console.log(v);
  return promise52
})

promise52.then(v => {
  console.log(2);
  console.log(v);
}, reason => {
  console.log(3);
  console.log(reason.message);
})
*/

// 实现：捕获错误
// 1. 捕获执行器执行错误
// 如果执行器中的代码有错误，那么 Promise 状态需要变为失败
// 21-22 √
/*
let promise61 = new MyPromise((resolve, reject) => {
  throw new Error('执行器执行错误');
})
promise61.then(v => {
  console.log(1);
  console.log(v);
}, res => {
  console.log(2);
  console.log(res.message);
})
*/

// 2. 捕获then执行时执行错误
// 23-24 √
/* 
function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if (result instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    result.then(resolve, reject)
  } else {
    // 普通值
    resolve(result)
  }
}

let promise62 = new MyPromise((resolve, reject) => {
  resolve('success');
})
promise62.then(v => {
  console.log(1);
  console.log(v);
  throw new Error('then error');
}, reason => {
  console.log(2);
  console.log(reason.message);
}).then(v => {
  console.log(3);
  console.log(v);
}, reason => {
  console.log(4);
  console.log(reason.message);
}) 
*/

// 实现：参考 fullfilled 状态下的处理方式，对 reject 和 pending 状进行补充
// 25-26 √
/*
function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if (result instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    result.then(resolve, reject)
  } else {
    // 普通值
    resolve(result)
  }
}
*/
/*
let promise7 = new MyPromise((resolve, reject) => {
  reject('failed');
})
promise7.then(v => {
  console.log(1);
  console.log(v);
}, reason => {
  console.log(2);
  console.log(reason);
  throw new Error('then error');
}).then(v => {
  console.log(3);
  console.log(v);
}, reason => {
  console.log(4);
  console.log(reason);
})
*/

// 实现：then参数变为可选
// 27 √
/*
function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if (result instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    result.then(resolve, reject)
  } else {
    // 普通值
    resolve(result)
  }
}
let promise8 = new MyPromise((resolve, reject) => {
  reject('failed');
})
promise8
  .then()
  .then()
  .then(undefined, err => { console.log(err); })
*/

// 实现 resolvePromise 方法
// 28-38 √
function resolvePromise (promise, result, resolve, reject) {
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }
  // 28. 如果 result 是对象或函数
  if (typeof result === 'object' || typeof result === 'function') {
    // 29.如果 x 是 null ，直接作为结果 resolve 
    // 这步可以省略，在外层的 if 多加一个判断
    if (result === null) {
      resolve(result);
    }

    // 30. 如果 result 是一个 thenable 对象
    let then;
    try {
      then = result.then;
    } catch (err) {
      // 31. result 不是 thenable 对象
      reject(err);
    }

    // 32.调用 thenable 对象的 then 方法
    if (typeof then === 'function') {
      // 35. 防止循环调用
      let called = false;
      queueMicrotask(() => {
        try {
          // 33. 将 result 作为 then 方法 this
          then.call(
            result,
            v => {  // 34.  then 方法的成功回调 resolvePromise
              if (called) return;
              called = true;
              resolvePromise(promise, v, resolve, reject);
            },
            err => {// 34.  then 方法的失败回调 rejectPromise
              if (called) return;
              called = true;
              reject(err);
            }
          )
        } catch (err) {
          // 36. then 方法执行错误 抛出异常
          // 如果 resolvePromise/rejectPromise 已经被调用, 直接返回
          if (called) return;
          reject(err);
        }
      })
    } else {
      // 37. 如果 then 不是函数，则将 result 作为参数传递给下一个 then 
      resolve(result);
    }
  } else {
    // 38. 如果  result 既不是函数也不是对象，将 result 作为参数传递给下一个 then
    resolve(result);
  }
}

/*
let promise9 = new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  // return function () { }; // 如果返回的是一个函数也是当 resolve 参数传递

  // const thenable = {  // 如果返回的是一个 thenable 对象，执行 then (这个then是微任务)
  //   then (res) {
  //     res(6)
  //   }
  // }
  // return thenable

  // 如果返回的是一个 promise 对象会比上面那种多执行一次
  // 原因是因为 promise 对象的 then 方法本身就是一个微任务
  // result.then 是一次微任务，promise.then 又是一次微任务
  // 而我们自己实现的 MyPromise 并没有第一次追加的微任务，也就是 result.then
  // 这个任务在我们自己实现的 MyPromise 中是一个同步任务，所以就会导致少了一轮微任务的情况
  // return Promise.resolve(6); 
}).then(res => {
  console.log(res);
})

let promise10 = new MyPromise((resolve, reject) => {
  resolve();
}).then(v => {
  console.log(1);

  // then 里面的 resolvePromise 会对当前这个 onfullfilled 进行校验
  // 发现 它(Promise对象) 身上有个 then 方法，就会执行 then 方法
  // 将 then 方法加入到 promise then 中调用时，会加入微任务队列一次
  // 而这个 then 方法是 Promise 对象的 then 方法，本身又是一个微任务，又会加入微任务队列一次
  // 所以会将其加入微任务队列
  // 而 return Promise.resolve(4) 也是一个性质等同于 return 一个 Promise 对象
  // return new MyPromise((resolve, reject) => {
  //   resolve(4)
  // })
  // return Promise.resolve(4);

  // 经过上面的分析可以看出直接 return 4 和 return 一个用 Promise 包装后的 4 是有区别的
  // 主要原因是因为 Promise 对象上有 thenable 方法并且这个 then 方法是个微任务
  // return 4

  // 经过代码可以看到，在执行 thenable 对象的 then 方法的时候
  // 其实是有将 resolve/reject 传入的，因此我们可以在这里调用并传回返回值
  // 因此也能进入下一步流程
  // return {
  //   then (resolve) {
  //     resolve(4);
  //   }
  // }

  // 如果是 return 一个 thenable 对象
  // 这个thenable 对象的 then 方法的返回值并不会被接收到，因为 then 方法只是被绑定 this 调用了
  // 没有接收 then 方法的返回值
  // 前面的之所以都可以执行下一步 then ，是因为他们内部状态改变了
  // 而这个 then 没有执行 resolve/reject 所以状态并没有改变
  // return {
  //   then() {
  //     return 4
  //   }
  // }

}).then(v => {
  // 在 promise 的 then 方法 resolve 后，log(v) 会被加入微任务队列
  console.log(v);
})

let promise11 = new MyPromise((resolve, reject) => {
  resolve()
}).then(v => {
  console.log(2);
}).then(v => {
  // 在 log(2) 执行完后会将 log(3) 加入微任务队列，处于 thenable 对象的 then 方法后面
  // thenable 对象 resolve 后，就轮到 log(3)
  console.log(3);
}).then(v => {
  // log(3) resolve 后，将 log(4) 加入微任务队列，处于 log(v) 后面
  console.log(5);
})
*/

/* 
function test () {
  console.log('test');
  return 1
}

let promise12 = new MyPromise((resolve, reject) => {
  resolve(12)
}).then(test)
  .then().then().then(v => {
    // log(3) resolve 后，将 log(4) 加入微任务队列，处于 log(v) 后面
    console.log(v);
  })
*/

let promise13 = new Promise((resolve, reject) => {
  resolve(13)
}).finally(() => {
  console.log('finally');
  return 14;
}).then((res) => {
  console.log(res);
})

// Promise.resolve(1).then((res) => {
//   console.log(res);
// })

// const thenableObj = {
//   then (resolve, reject) {
//     reject('error')
//   }
// }

MyPromise.reject('error')
  .then(null, (reason) => {
    console.log(222);
    throw reason
  })
  .catch(reason => {
    console.error('!!!' + reason);
  })


export default MyPromise;

/* MyPromise.resolve()
  .then(() => {
    return MyPromise.resolve(4) // 1. MyPromise.resolve(4) 这个 thenable 对象在 resolvePromise 中延迟一次
  })                            // 2. MyPromise.resolve(4).then 本身带有一次延迟
  .then((res) => {
    console.log(res)
  })
MyPromise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(5)
  })
  .then(() => {
    console.log(6)
  }) */