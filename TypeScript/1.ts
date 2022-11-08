// type Obj = { i : number ; a : number | string };
interface Obj {
  i?: number,
  a: number | string,
}

const obj = {
  i: 0,
  get a () {
    const arr = [1, '1'];
    return arr[this.i++];
  }
}
console.log(obj.a);
console.log(obj.a);


export {};

function isString1(value: any): value is string {
  return typeof value === "string";
}

const res = isString1('11');
res

function isString2(value: any): boolean {
  return typeof value === "string";
}



type Test<T> = [T] extends [T] ? T[] : never 

type TestDistribute<T> = T extends T ? T[] : never 


// type Test1 = (1 | 2)[]
type Test1 = Test<1 | 2>

// type Test2 = 1[] | 2[]
type Test2 = TestDistribute<1 | 2>

