const fs = require('fs');

// 1.普通读取
// try {  // 错误处理
//   fs.readFile('./promise.md', (err, data) => {
//     if (err) throw err;
//     console.log(data);
//   })
// } catch (e) {
//   console.warn(e);
// }
// console.log(1);

// 2.运用 promise 异步读取
function readFile () {
  return new Promise((resolve, reject) => {
    fs.readFile('./promise.m', (err, data) => {
      if (err) reject(err);
      resolve(data)
    })
  })
}
console.log(2);
readFile()
  .then((v) => {
    console.log(v.toString());
    // 将'由异步任务结果决定'的代码放在 then 中
    console.log('由文件值决定');
  })
  .then(() => {
    console.log(3);
  })
  .catch((err) => { // 处理错误,不影响 catch 后面操作,catch前面的操作跳过
    console.warn(err)
  })
  .then(() => {
    console.log(4);
  })


// 3. 运用 promise 异步请求
//创建 Promise
function asyncRequest (url) {
  return new Promise((resolve, reject) => {
    //1.创建对象(node环境不内置XMLHttpRequest需要手动安装,仅在浏览器环境内置)
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json'
    //2. 初始化
    xhr.open('GET', url);
    //3. 处理响应结果
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        //判断响应状态码 2xx   
        if (xhr.status >= 200 && xhr.status < 300) {
          //控制台输出响应体
          resolve(xhr.response);
        } else {
          //控制台输出响应状态码
          reject(xhr.status);
        }
      }
    }
    // 4. 处理错误结果
    xhr.onerror = function () {
      reject(e);
    }
    //5. 发送
    xhr.send();
  });
}
//调用then方法
asyncRequest('https://api.apiopen.top/getJoke')
  .then(value => {
    console.log(value);
  }, reason => {
    console.warn(reason);
  });