const a = {
  *[Symbol.iterator] () {
    yield 1;
    yield 2;
  }
}

class makeIterator {
  constructor(arr) {
    arr[Symbol.iterator] = function () {
      let i = 0, j = 0;
      return {
        next () {
          if (i >= arr.length) return { value: undefined, done: true };
          let value = arr[i][j];
          j++;
          if (j >= arr[i].length) {
            i++;
            j = 0;
          }
          return {
            value,
            done: false
          };
        }
      }
    }
    this.iterator = arr[Symbol.iterator]();
  }
  next () {
    return this.iterator.next().value
  }
}
let m = new makeIterator([[1, 4, 7], [2, 9], [8, 7, 6, 3]]);

console.log(m.next());
console.log(m.next());
console.log(m.next());
console.log(m.next());
console.log(m.next());
console.log(m.next());
console.log(m.next());
console.log(m.next());
console.log(m.next());
console.log(m.next());
console.log(m.next());