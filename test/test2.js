import * as A from './test1.js'
// global._foo = '123'
// console.log(global._foo);
// console.log(globalThis[Symbol.for('foo')]);
// console.log(A.default.foo);
// A.area = null // error
A.area()
console.log(A.default);

import { testObj } from './test1.js'
console.log(testObj.d);
testObj.d = 3