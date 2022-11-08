## typeScript 高级类型

### 1. 交叉类型 &

```tsx
interface Person {
  name: string
  age: number
}

interface Animal {
  name: string
  color: string
}

const x: Person & Animal = {
  name: 'x',
  age: 1,
  color: 'red'
}
```

### 2. 联合类型 |

```tsx
function genLen(x: string | any[]) {
  return x.length;
}

genLen(""); // ok
genLen([]); // ok
genLen(1); // error

// 也可以用联合类型描述 枚举
type Position = "UP" | "DOWN" | "LEFT" | "RIGHT";
```


### 内置映射类型

### 1 Partial

```tsx
// Partial<T>  将 T 中的所有属性变成可选

type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 2 Required

```ts
// Required<T>  将 T 中的所有属性变成必选

type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

### 3 Readonly

```tsx
// Readonly<T>  将 T 中的所有属性变成只读

type MReadonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### 4 Pick

```ts
// Pick<T,U>  选择 T 中可以赋值给 U 的类型( U 必须是 T 的子类)
(U 为联合类型，继承自 keyof T， T 为对象格式的 type， 返回对象格式的 type)

type Pick<T, U extends keyof T> = {
  [P in U]: T[P];
};
```

### 6 Record

```tsx
// Record<K,T> 生成一个 键为 K ，值为 T 的对象类型

type Record<K extends string, T> = {
    [P in K]: T;
}

// 小知识：
someType extends Record<string, any>  // 所有的引用数据类型都可以通过类型检查
someType extends Record<string, unknown>  // 只有"纯对象" 才能通过类型检查, map/set/class/Promise/Array 都不可以
```

### 4 Exclued

```ts
// Exclude<T,U>  从 T 中剔除可以赋值给 U 的类型
( T 和 U 都是联合类型, 返回一个 联合类型 )

type Exclude<T, U> = T extends U ? never : T; // 对于联合类型，extends 会进行条件分发

// 相当于: type A = 'a'
type A = Exclude<'x' | 'a', 'x' | 'y' | 'z'>
```

### 6 Extract

```tsx
// Extract<T,U>  从 T 中提取可以赋值给 U 的类型
( T 和 U 都是联合类型, 返回一个 联合类型 )

type Extract<T, U> = T extends U ? T : never;

// 相当于: type A = 'x'
type A = Extract<'x' | 'a', 'x' | 'y' | 'z'>
```

### 7 Omit

```tsx
// Omit<T,U>  创建一个省略 U 中字段的 T 对象
( U 是联合类型--且继承自 keyof T ，T 是 interface ，返回一个 interface )

type MOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
}
```

### 7 Dictionary

### 8 Many

### 9 Parameters

```tsx
// 获取函数的参数
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
```

### 10 ReturnType

```tsx
// 获取函数返回值的类型
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```

### 11 ConstructorParameters

```tsx
// 获取构造函数中的参数类型
type Parameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;
```

### 12 InstanceType

```tsx
// 获取构造函数产生的实例的类型
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer P ? P : any;
```

### 13 UpperCase

### 14 LowerCase

### 15 Capitalize
