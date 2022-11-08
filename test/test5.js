function getRes (arr, m, n) {
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (i - 1 > 0 && j - 1 > 0) {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + arr[i - 1][j - 1];
            } else if (i - 1 === 0) {
                dp[i][j] = dp[i][j - 1] + arr[i - 1][j - 1];
            } else {
                dp[i][j] = dp[i - 1][j] + arr[i - 1][j - 1];
            }
        }
    }
    console.log(dp);
    return dp[m][n];
}
let arr = [
    [1, 3, 1, 2],
    [1, 5, 1, 3],
    [4, 2, 1, 4]
];
// console.log(getRes(arr, arr.length, arr[0].length));


function pailie (arr) {
    let res = []
    const dfs = (path, start) => {
        if (path.length === arr.length) {
            res.push(path)
            return
        }
        for (let i = 0; i < arr[start].length; i++) {
            dfs(path + arr[start][i], start + 1);
        }
    }
    dfs("", 0)
    return res
}
arr = [['A', 'B'], ['a', 'b', 'c'], ['1', '2', '3']];
// console.log(pailie(arr));

function test (a, b) {
    a = 1;
    console.log(a, arguments[0]);
    arguments[1] = 2;
    console.log(b, arguments[1]);
}

// test('a1', 'a2');

function b1 (c) {
    a = 1;  // 浏览器环境下会被提升到全局作用域，作为 window 的属性
    let b = 2;
    console.log(a, b, c);
}
b1(3);
console.log(a); // 1, 取决于运行环境哈

function b2 (a) {
    a = 1;
    let b = 2;
    console.log(a, b);
}
b2(3);
console.log(a); // 报错，别想太多哈，自己看原因

function b3 (c) {
    console.log(a);
    a = 1;
    let b = 2;
    console.log(a, b, c);
    function a () { }
}
b3(3);
console.log(a);  // 报错，自己看原因，涉及 VO 的初始化

function b4 (a) {
    console.log(a); // 3，自己看原因，虽然 var a 提升到了头部，但是由于函数形参 a 已经存在
    var a = 1;      // 所以 a 的提升并不影响，所以上面的值不会被 undefined 覆盖
    let b = 2;      // 但是下一句输出的 a = l1 的赋值是在执行到 var a = 1 时执行的
    console.log(a, b);  // 1,2，自己看原因
}
b4(3);
console.log(a); // 报错，自己看原因

function b5 (b) {
    console.log(a);
    let a = 1;
    function a () { }
    console.log(a);  // 报错，自己看原因
}
b5(3);