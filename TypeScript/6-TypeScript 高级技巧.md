## TypeScript 高级技巧

### 1 keyof

```ts
// keyof 操作符可以用于[可遍历类型: interface/type-Object]的所有键，其返回类型是联合类型

interface InterfaceTest {
  x: number;
  y: number;
}

type ObjectTest = {
  x: number;
  y: number;
};

type keysIn = keyof InterfaceTest; // "x" | "y"
type keysOb = keyof ObjectTest; // "x" | "y"

// keyof 也可以遍历一个 type 数组--数组本质还是对象
type test<T extends readonly any[]> = {
  [P in keyof T]: number; // keyof 取到了数组的索引
};
const arr = ["a", "b", "c"] as const;
type ArrayType = typeof arr;
type Result = test<ArrayType>; // [number,number,number]
```

### 2 typeof

```ts
// typeof 取某个值的 type
const a: number = 3;
const b: typeof a = 4; // 相当于: const b: number = 4

// typeof 和 instanceof 都可以实现类型保护，
```

### 3 is

```ts
// is 用来判定值的类型，作为类型保护

function isString(value: any): value is string {
  return typeof value === "string";
}

function isString(value: any): boolean {
  return typeof value === "string";
}

// 两者的区别在于：
// 如果执行第一个 isString 方法并返回了 true , 那么入参 value 也会被修改成 string 类型 -- 第二种不会影响 value 的类型
// ( 这对我们后续再使用 value 时的类型保护很有作用 )
```

### 4 in 关键字

```ts
in 可以对联合类型进行遍历，// 只可以用在 type 关键词下面

type Person = {
  [key in 'name' | 'age']: number
}

// { name: number; age: number; }
```

### 5 [ ] 操作符

```tsx
// 使用 [] 操作符可以对接口进行索引访问
interface Person {
  name: string;
  age: number;
}
type x = Person["name"]; // x is string
```

```tsx
// [number] 可以遍历一个 type 数组，返回一个 联合类型
type saveType = [string, number];
type mayType = saveType[number]; // string | number
```

```tsx
// 如下应用： 我们通过 [number] 获取到返回的联合类型并通过 in 关键字遍历
传入一个元组类型，将这个元组类型转换为对象类型，这个对象类型的键/值都是从元组中遍历出来。

type TupleToObject<T extends readonly any[]> = {
    [P in T[number]]: P
}


const tuple = ['yasuo', 'zed', 'giao'] as const;
type result = TupleToObject<typeof tuple>;
```

### 6 extends 条件分发

```tsx
// 对于 T extends U ? X : Y 来说，存在一个特性，当 T 是一个联合类型时，会进行条件分发

type Union = string | number;
type isNumber<T> = T extends number ? "isNumber" : "notNumber";

type UnionType = isNumber<Union>; // 'notNumber' | 'isNumber'。
```

### 7 as const 断言

as const 作用

1. 添加 readonly 修饰，[1, 2, 3] as const = readonly [1, 2, 3]
2. 类型不会被合并，[1, 2, 3] as const = readonly [1, 2, 3] 而不是 number[]

```tsx
// const 断言基于类型拓展，其实很好理解：
const x = "x"; // has type 'x'
let y = "y"; // has type string
let y = "y" as const; // has type 'y'

// 我们可以理解const断言某个类型为 readonly
```

```tsx
// 同理，对于一个对象：
const yasuo = {
  name: "yasuo",
  age: 19
} as const;

// 等效于：
const yasuo = {
  name: "yasuo",
  age: 19
};
```

```tsx
// 对于一个数组，会产生一个 只读 元组
const arr = [0, 1, 2, 3] as const;
arr[0] = 1; // err
arr.push(4); // err
```

### 8 infer 关键字

```tsx
// infer 用于推导泛型参数
infer 最早出现在此 PR 中，表示在 extends 条件语句中待推断的类型变量
```

#### 举例：

```tsx
// 1. 简单举例：获取待推断函数的入参
type ParamType<T> = T extends (param: infer P) => any ? P : T; // 此处 infer p 表示待推断的函数参数

interface Giao {
  name: string;
  age: number;
}

type Func = (param: Giao) => void;

type paramType = ParamType<Func>; // Giao
type noGiaoType = ParamType<string>; // string
```

```tsx
// 2. RetuType<T> 用于提取函数类型的返回值
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```

```tsx
// 3. 用于提取构造函数中参数/ 构造函数产生的实例 类型
(1) 获取构造函数中的参数类型 // infer P 可存储， 如果有多个类型符合的情况下 会用数组进行包裹
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;
(2) 获取构造函数产生的实例的类型
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer P ? P : any;
```

```tsx
// 手写一下：
type _ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
type _InstanceType<T> = T extends new (...args: any[]) => infer P ? P : any;

class TestClass {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

type classType = _ConstructorParameters<typeof TestClass>; // [name:string,age:number];

type newClassType = _InstanceType<typeof TestClass>; // TestClass(构造函数实例的类型就用这个类名字段描述)
const testPerson: newClassType = new TestClass("yasuo", 19); // 无报错，说明是没有问题的
```
