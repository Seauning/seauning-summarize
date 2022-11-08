function promiseAll (list, concurrency = Infinity) {
  if (typeof list[Symbol.iterator] !== 'function') throw new TypeError('');
  const len = list.length;
  return new Promise((resolve, reject) => {
    let currentIndex = 0;
    let res = [];
    let resolveCount = 0;
    function next () {
      const index = currentIndex;
      currentIndex++;
      Promise.resolve(list[index])
        .then((o) => {
          res[index] = o;
          resolveCount++;
          if (resolveCount === len) {
            resolve(res);
          }
          if (currentIndex < len) {
            next();
          }
        })
        .catch((e) => {
          reject(e);
        });
    }

    for (let i = 0; i < concurrency && i < len; i++) {
      next();
    }
  });
}