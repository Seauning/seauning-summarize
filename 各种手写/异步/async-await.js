function co (gen) {

  return new Promise((resolve, reject) => {
    const iterator = gen();
    if (!iterator) resolve(iterator)
    function next (res) {
      let result;
      try {
        result = iterator.next(res);
      } catch (e) {
        return reject(e);
      }
      const { value, done } = result;
      if (done) return resolve(value);
      let promiseValue;
      try {
        promiseValue = Promise.resolve(value);
      } catch (e) {
        reject(e)
      }
      promiseValue.then((res2) => {
        next(res2);
      }, reject)
    }
    next()
  })
}

function timeout (num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(num);
      resolve();
    }, 1000)
  })
}

function* genrator () {
  const res1 = yield timeout(1);
  const res2 = yield timeout(2);
  const res3 = yield timeout(3);
  const res4 = yield timeout(4);
}

co(genrator)