const promises = [
  () => {
    return new Promise((res) => {
      setTimeout(() => {
        console.log(1);
        res()
      }, 3000)
    })
  },
  () => {
    return new Promise((res) => {
      setTimeout(() => {
        console.log(2);
        res()
      }, 2000)
    })
  },
];

function autoRun (generator) {
  const g = generator();
  function next (arg) {
    const { value, done } = g.next(arg);
    if (done) return;
    Promise.resolve(value).then((res) => {
      next(res);
    })
  }
  next();
}

(async (autoRun, promises) => {

  const g = function* () {
    for (let i = 0; i < promises.length; i++) {
      yield promises[i]();
    }
  }

  autoRun(g);

})(autoRun, promises);
