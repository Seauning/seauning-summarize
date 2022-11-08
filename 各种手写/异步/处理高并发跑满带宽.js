// 模拟一百条数据
const message = new Array(100).fill('');
for (let i = 0; i < 100; i++) {
  message[i] = '第' + i + '条数据';
}
// 模拟请求一千条数据
function axiosGet (idx) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(message[idx]);
    }, 1000 * Math.random());
  })
}
// 100 条数据, 最大带宽为10, 怎么尽可能跑满带宽
function download () {
  return new Promise((resolve, reject) => {
    const _resolve = resolve;
    const ans = []; // 答案
    // 进程池
    const process = [];
    let num = 0;
    while (num < 10) {
      addProcess(num);
      num++;
    }
    // 添加进程
    function addProcess (id) {
      const work = axiosGet(id).then(res => {
        console.log(res);
        ans.push(res);
        // 这里走 微任务, 我们直接拿到 work 进行删除
        const index = process.indexOf(work);
        process.splice(index, 1);
        if (process.length === 0) _resolve(ans); // 进程池走完
        if (num < 99) addProcess(++num); // 任务跑完
      });
      process.push(work);
    }
  })
}
download().then(res => {
  console.log(res);
})