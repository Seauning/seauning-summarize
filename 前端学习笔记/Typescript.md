# Typescript

# 基础篇

[TypeScript Documentation](https://www.typescriptlang.org/docs/)

[ts 初识](https://mp.weixin.qq.com/s/L09DH0-GqDBW8a_wSmuGBQ)

[TypeScript Overview](https://www.tutorialsteacher.com/typescript/typescript-overview)

## typescript?

Typescript 是 Javascript 的超集，Javascript 程序的静态检查器，一个在代码运行前的工具（静态）并确保程序的类型正确（类型检查）。

Typescript 只负责检查代码不会改变 Javascript 的运行时行为，只要编译检查完成，它就会删除类型并产生编译后代码的结果，生成的纯 Javascript 代码就没有类型信息。

Typescript 提供了 Javascript 的所有功能，以及在原有 Javascript 功能之上的附加层 —— Typescript 类型系统。

例如：Javascript 也提供了原始数据类型如 `string` 和 `number` 的语法，但它不会检查可能会不断赋值的那些，在这方面 Typescript 也是一致的。

## generics 泛型

```js
// 用 Type 表明一个未知的类型，用于描述参数与返回值的关系
function firstElement<Type>(arr: Type[]): Type | undefined {}

// 多个 Type ，用于表示输入的数组每一项的类型，以及输入的函数的函数参数和返回值类型
// 并用输入的函数的返回值类型，作为该函数的输出数组项的类型
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {}

// extends 限制泛型
function longer <Type extends { length: number }> (a : Type, b : Type) : Type {
  return a.length >= b.length ? a : b;
}
console.log(longer([1, 2], [1, 2, 3]));
console.log(longer("alice", "bob"))

// 调用函数时手动指定函数的泛型是什么类型
function combine<Type>(arr1 : Type[], arr2 : Type[]) : Type[] {
  return [...arr1, arr2]
}
const arr = combine<string | number>([1, 2, 3], ['hellor']);

// 可选(optional)参数
function myForEach<Type>(
  arr : Type[] ,
  callback : (arg : Type , index ?: number, arr ?: Type[]) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

### 类中使用泛型以及继承的高级用法

```ts
class BeeKeeper {
    hasMask: boolean = true;
}

class ZooKeeper {
    nametag: string = "Mikle";
}

class Animal {
    numLegs: number = 4;
}

class Bee extends Animal {
    keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```

## 联合类型

[union to tuple](https://github.com/microsoft/TypeScript/issues/13298)

[2946 - ObjectEntries - Tuple instead of Union](https://github.com/type-challenges/type-challenges/issues/3656)

## keyof

keyof 作用于一个 `interface` 或者 `type-Object`，并且会产生一个它所有的键的 字符串/数字 字面量 的联合 `union`。

keyof 与映射类型结合时将非常有用。

```ts
type Point = { x: number; y: number };
type P = keyof Point; // P is the same type as 'x'|'y'
```

而如果对象采用的是 `string` 或 `number` 的索引签名，`keyof` 返回的将是索引的类型。

```ts
type array = { [n: number]: unknown };
type A = keyof array; // type A = number
type map = { [k: string]: boolean };
type M = keyof map; // string | number，map[0] 这种情况 0 会被转为 string 变为 map['0']
```

[使用括号时，keyof 枚举类型中键的映射类型不同](https://github.com/microsoft/TypeScript/issues/40206)

[映射类型有时只知道属性键何时是可选的](https://github.com/microsoft/TypeScript/issues/40190)

[当 keyof 作用在一个可选的属性上时，结果包含 undefined](https://github.com/microsoft/TypeScript/issues/34992)

[错误的使可选属性成为必须的](https://github.com/microsoft/TypeScript/issues/46482)

## typeof

ts 增加了支持 ts 类型语法的 `typeof` 运算符，可以在 ts 的 `类型` 中使用 `typeof` 来引用 `变量` 或 `属性` 的类型，并且 ts 对 `typeof` 能使用的类型也有做限制。

我们只能在 `变量` 或 `属性` 上使用，它并不支持对 **值本身** 使用。

```ts
// 基本数据类型
let s = "hello";
let n: typeof s;
let m : typeof '1'; // identify unexpected

declare const msgbox : () => boolean;
let shouldContinue : typeof msgbox('11');// ',' expected.
```

### ReturnType 预定义类型

通过向 ReturnType 传入一个 ts 的 **函数类型别名** ，可以得到它的**返回值类型**。

注意：不能直接用在**值(变量或属性)**上 。

```ts
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;

function f() {
    return { x: 10, y: 3 };
}
type P = ReturnType<f>; // f 是一个值而不是一个类型
```

这时候我们就可以借助 `typeof` 来获取一个 **变量或属性** 的类型。

```ts
function f() {
    return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>; // type P = { x: number; y: number };
```

当我们尝试带有多个调用签名的类型中推断时，推断的结果只会由最后一个前面决定。

```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): number;
declare function stringOrNum(x: number | string): number | string;

// a : {
//     (x: string): number;
//     (x: number): string;
//     (x: string | number): string | number;
// }
let a: typeof stringOrNum;

type T1 = ReturnType<typeof stringOrNum>; // string | number
```

## 条件类型 extends

条件类型基于输入描述输入与输出的关系

```ts
interface Animal {
    live(): void;
}
interface Dog extends Animal {
    woof(): void;
}
type example1 = Dog extends Animal ? number : string; // number
type example2 = RegExp extends Animal ? number : string; // string
```

### 结合泛型使用条件类型

由下面这个例子可以看出这与函数重载有很大的区别，对于每一种可能的情况，函数重载会造成代码的冗余。

```ts
interface IdLabel {
    id: number;
}
interface NameLabel {
    name: string;
}
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
    throw "eee";
}
let a = createLabel("ts");
let b = createLabel(2222);
let c = createLabel(Math.random() ? "hello" : 42);
```

### 条件类型约束

有时候我们会想要在使用泛型的时候，通过索引来访问泛型变量上的某个属性的类型。这时候仅仅用泛型是不能成功的，需要限制泛型的属性，就像下面一样。

```ts
// fail
type MessageOf<T> = T["message"];

// success
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
    message: string;
}
type EmailMessageContents = MessageOf<Email>; // string
```

但如果我们想要在它不满足限制条件的时候让其默认为 `never` 呢，这时候需要这样做。

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Dog {
    bark(): void;
}
type DogMessageContents = MessageOf<Dog>; // never
```

我们不直接限制泛型，而是对泛型变量进行条件约束的判断，这样就能实现在不满足条件时具有默认类型。

```ts
type Flatten<T> = T extends any[] ? T[number] : T; // T 是一个数组吗？是的话通过索引类型来访问元素的类型，否则就保持原状
type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number
```

上面是一个更加有趣的例子，我们通过索引类型来结合泛型限制，实现数组的拍平，只有在传入参数为数组类型时会拍平，否则就不改变。

### 结合 infer 关键字的条件类型推断

由上面可以发现我们通过条件类型进行限制并且精确它输出的类型，但我们还是通过 `T[number]` 这种索引的方式来访问类型，条件类型通过 `infer` 关键字帮我们推断出类型，而不用通过索引手动获取类型。

```ts
type Flatten<Type> = Type extends Array<infer ItemType> ? ItemType : Type;
```

我们可以结合 `infer` 关键字写出一些有用的 类型别名 帮助者。

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer ReturnType ? ReturnType : never;

type Num = GetReturnType<() => number>; // number
type Str = GetReturnType<(x: string) => string>; // string
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>; // boolean[]
```

### 分布式条件类型

> [参考](https://github.com/microsoft/TypeScript/issues/23182)  
> [参考](https://github.com/type-challenges/type-challenges/issues/614)

当条件类型作用在泛型时，如果传入的类型时 `union` 联合类型，那么条件类型将变为分布式的。

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]

type StrArrOrNumArr = ToArray<string> | ToArray<number>; // string[] | number[]
```

我们发现我们传入的是一个联合类型，我们实际上是想让数组中的每一个元素可能为 string 或 number ，但这并不如我们预期所想，这是因为条件类型将 `union` 中的每个成员都被映射到 Type 上，为了解决这个问题，我们可以用 `[]` 来包裹 Type ，表示 Type 是数组元素的类型。

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

type StrOrNumArr = TyArrayNonDist<string | number>; // (string | number)[]
```

### **真正理解分布式条件类型**

```ts
interface TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
}
```

```ts
type NullDistribute<T> = T extends TreeNode ? T[] : T;
type Null<T> = [T] extends [TreeNode] ? T[] : T;

// TreeNode[] | null
type NullDistribute1 = NullDistribute<TreeNode | null>;
// TreeNode | null
type Null1 = Null<TreeNode | null>;

// string[] | number[] | object[] | TreeNode[]
type NullDistribute2 = NullDistribute<TreeNode | number | "aaa" | string | 123 | object>;
```

我们从条件类型的执行过程来看它是如何分发条件的：

如 NullDistribute1 ，传入了 `TreeNode | null` 这个泛型，TreeNode 和 null `分别` 进行条件类型的判断，也就是判断是否 extends TreeNode ，很明显 TreeNode 是，而 null 不是，所以它们两分别得到了 TreeNode[] 和 null ，然后再通过 | 联合起来，也就是 `TreeNode[] | null`。

还能再换个思路来想， `NullDistribute<TreeNode | null>` = `NullDistribute<TreeNode> | NullDistribute<null>` = `TreeNode[] | null` ，把它当做分别调用一次 NullDistribute 。

再看看 Null1 ，这里的 Null 使用了 [] 让条件类型变为非分布式的，所以不会如上面一样分别传入再判断或者分别调用。而是直接比较整个传入参数的结构 和 条件 是否匹配。

### 条件类型的递归及尾递归优化

```ts
interface Node {
    val: any;
    left: Node;
    right: Node;
}

type Recursion<T extends Node> = T extends Node
    ? // 类型实例化过深，且可能无限。ts(2589)
      // 表达式生成的联合类型过于复杂，无法表示。
      [...Recursion<T["left"]>, T["val"], ...Recursion<T["right"]>]
    : [];
```

ts 会对每个 type 进行预检测，如上面这段代码，ts 会将传入参数限定为 Node 并进行检测，  
因为 Node 这个对象类型是嵌套 Node 的，所以当发生递归时便会检测出实例化过深的错误。

若我们修改为如下的方式，则不会出现错误。

```ts
type Recursion<T extends Node> = [T] extends Node ? [...Recursion<T["left"]>, T["val"], ...Recursion<T["right"]>] : [];
```

如上，我们用 [] 限制条件类型中的任意一个都可以，添加之后就不会出现实例化过深的错误。

> Nice Article！！[Tail recursive evaluation of conditional types](https://github.com/microsoft/TypeScript/pull/45711)

## 映射类型

**映射类型只能在 `type` 中使用，在 interface 中使用会报错**。

映射类型通常需要用到索引签名的语法，常用于声明未提前声明的属性值的类型，并且通常配合 `keyof` 遍历类型上所有的键来使用。

如下面这个例子将原本的键对应的值的类型覆盖为 boolean。

```ts
type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
};

type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
};
//  type FeatureOptions = {
//     darkMode: boolean;
//     newUserProfile: boolean;
// }
type FeatureOptions = OptionsFlags<FeatureFlags>;
```

### mapped 属性修饰符

`readonly` 和 `?` 分别用于影响易变性和可选性，可以移除和增加这些修饰符通过 `-` 或 `+` 前缀，如果没有使用修饰符，那么 `默认是 +` 。

下面这个例子会让原本 `readonly` 的属性去除 `readonly`。

```ts
type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
    readonly id: string;
    readonly name: string;
};

// {
//     id: string;
//     name: string;
// }
type UnlockedAccount = CreateMutable<LockedAccount>;
```

下面这个例子会让原本 `可选` 的属性去除 变为 `必选` 。

```ts
type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
};
type MaybeUser = {
    id: string;
    name?: string;
    age?: number;
};

// {
//     id: string;
//     name: string;
//     age: number;
// }
type User = Concrete<MaybeUser>;
```

### as 的键重映射

ts 4.1 版本以上允许我们通过 `as` 重新命名 键类型名，并且借助 ts 的模板字符串语法可以从以前的属性中创建新的属性名称。

```ts
type Getters<Type> = {
    // Capitalize 是 ts 内置的一个泛型
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
    name: string;
    age: number;
    location: string;
}

// {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }
type LazyPerson = Getters<Person>;
```

**我们可以通过条件类型返回一个 `never` 来过滤掉键**

```ts
type FilterIndexSignature<T> = {
    [key in keyof T as key extends `${infer keyStr}` ? keyStr : never]: T[key];
};
```

如上面这个例子，通过 as 重映射，以及结合条件类型返回一个 `never` 我们可以过滤掉索引签名。

结合 as 和 泛型 我们可以实现一些有趣的玩法，下面这个例子中 `Exclude` 是 ts 内置的一个泛型。

```ts
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property];
};
interface Circle {
    kind: "circlr";
    radius: number;
}
type KindlessCircle = RemoveKindField<Circle>; // { radius : number }
```

并且我们也能映射 任意类型 的联合。

```ts
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
};
type SquareEvent = { kind: "square"; x: number; y: number };
type CircleEvent = { kind: "circle"; radius: number };

// {
//     square: (event: SquareEvent) => void;
//     circle: (event: CircleEvent) => void;
// }
type Config = EventConfig<SquareEvent | CircleEvent>;
```

###

映射类型还有很多有趣的玩法，并且它能和许多的类型操作很好的配合。

下面就是一个映射和条件类型配合的玩法：

```ts
type ExtrackPII<Type> = {
    [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
    id: { format: "icrementing" };
    name: { type: string; pii: true };
};

// {
//    id: false;
//    name: true;
// }
type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
```

## 模板字面量类型

从映射类型的几个例子我们简单了解了模板字面量的用法，当我们在模板字面量的插入位置中使用联合类型时，得到的类型将是由每个联合成员表示的，每个可能的字符串字面量的联合

```ts
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`; // "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

当一个我们在模板字符串的多个插入位置使用联合类型时，联合类型将会交叉相乘

```ts
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type lang = "en" | "ja" | "pt";

// "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" |
// "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" |
// "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" |
// "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
type LocaleMessageIDs = `${Lang}_${AllLocaleIds}`;
```

### type 的字符串联合

模板字符串的强大，在于使用一个类型内部的信息，来定义一个新的字符串

下面是一个例子，我们想用一个 `makeWatchObject` 函数为一个对象**新增**一个 `on` 方法，表示对事件添加监听器，这个 `on` 方法有两个参数，第一个参数是 `eventName` 它由对象上的 属性名 + Changed 组成，例如 firtName 属性对应的事件名为 firstNameChanged ，第二个参数是一个事件的回调 ，这个回调函数是 `callback : (newValue : any) => void` 的格式。

```ts
type PropEventSource<Type> = {
    // 这里我们通过 keyof Type 和 string 拿到了所有的字符串类型的属性
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

// 注意这里采用了个 & 运算符，这不会导致原有的属性失去
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = {
    firstName: "bob",
    lastName: "li",
    age: 11,
    0: true,
    "1": "one"
};

const withOnPerson = makeWatchedObject(person);
withOnPerson.on("firstNameChanged", () => {});
// Argument of type '"lastName"' is not assignable to parameter of type
// '"firstNameChanged" | "lastNameChanged" | "ageChanged" | "0Changed"'
withOnPerson.on("lastName", () => {});
withOnPerson.on("0Changed", () => {}); // error
withOnPerson.on("1Changed", () => {}); // success
```

上面这个例子中还不是特别的完善，我们发现每一个回调函数的传入参数是一个 `any` 类型，实际上我们知道监听的属性的类型，所有应该对事件监听器的回调中传入参数类型进行限制，我们可以借助函数泛型，并通过条件限制 `Key` ，如下面这种我们就对传入参数进行了限制：

```ts
type PropEventSource<Type> = {
    // 这而表示 Key 被限制在 Type 的 string 类型的键中
    on<Key extends string & keyof Type>(eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};

person.on("firstNameChanged", newName => {
    // (parameter) newName: string
    console.log(`new name is ${newName.toUpperCase()}`);
});
```

### 内置的字符串字面量操作类型

ts 内置了一些字符串操作类型，内置于编译器并能提高编译的性能，且在 `.d.ts` 文件中无法找到

-   `Uppercase<StringType>`，返回 `StringType` 的大写

-   `Lowercase<StringType>`，返回 `StringType` 的小写

-   `Capitalize<StringType>`，返回 `StringType` 的首字母大写

-   `Uncapitalize<StringType>`，返回 `StringType` 的首字母小写

## function

函数类型的两种写法：

1. 函数类型表达式

```ts
type Options = {
    data?: () => object;
};
```

2. 对象类型描述函数

```ts
type Data = {
    (): object;
};
type Options = {
    data?: Data;
};
```

如果函数将作为构造函数使用，可以在函数类型前添加 `new` 关键字作为一个构造签名，**这仅适用于函数参数**：

```ts
type SomeConstructor = {
    new (): SomeObject;
};
function fn(ctor: SomeConstructor) {
    return new ctor();
}
```

有一些函数，既可以用 new 调用，也可以直接调用，可以组合 构造签名和函数签名：

```ts
type CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

### 函数重载

```ts
function len(s: string): number;
function len(arr: any[]): number;
// function len(arr: any[] | string): number;  // 加上这个就对了
function len(x: any) {
    return x.length;
}

len(""); // OK
len([0]); // OK
// error ，没有匹配的既可能为 string 又可能为 any[] 的重载
len(Math.random() > 0.5 ? "hello" : [0]);

// 如果能用联合类型实现，应该尽可能使用联合类型而不是重载
function len(x: any[] | string) {
    return x.length;
}
```

### 使用 this

1. 对象的函数属性

ts 会推断 user.isAdmin 的 this 为外部的对象 user

```ts
const user = {
    admin: false,
    isAdmin() {
        return this.admin;
    }
};
```

2. 普通函数中的 this 参数

js 不允许 this 作为参数， ts 则可以通过 this 声明 this 的类型

```ts
interface User {
  id: number;
  admin: boolean;-
}

// 声明 getDB
declare const getDB: () => DB;

// 创建命名空间
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();

const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

上面的写法在回调函数中很常见，用另一个对象来控制回调函数的调用，并且这里只能使用普通函数，而不是箭头函数。

### 如何使用 rest 参数

```ts
function multiply(n: number, ...m: number[]) {
    return m.map(x => n * x);
}
const a = multiply(10, 1, 2, 3, 4);
```

typescript 中的类型注释是隐式 `any[]` 而不是 `any` ，并且给定的任何类型数组都必须是 `Array<T>` 或 `T[]` 或 元组。

### 如何使用扩展运算符

```ts
const args = [8, 5];
// 这会出现一个错误，扩展运算符必须具有元组类型或者传递给一个剩余参数
const angle = Math.atan2(...args);

// 解决方法取决于代码，但最快的方式是使用一个 const 上下文
const args = [8, 5] as const;
const angle = Math.atan2(...args);
```

### 参数解构

```ts
function sum({ a, b, c }: { a: number; b: number; c: number }) {
    console.log(a + b + c);
}
// or
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
    console.log(a + b + c);
}
```

### 函数的可分配性

具有 `void` 返回值类型的 **上下文类型** 的函数不会强制函数不能返回内容。

```ts
type voidFunc = () => void;

const f1: voidFunc = () => {
    return true;
};
const f2: voidFunc = () => true;
const f3: voidFunc = function () {
    return true;
};
```

如果 **字面量函数** 的定义有一个 `void` 的返回值类型，那它会强制不返回任何值。

```ts
function f2(): void {
    return true; // Type 'boolean' is not assignable to type 'void'.
}

const f3 = function (): void {
    return true;
};
```

## object

### 解构赋值

在函数参数中使用解构赋值时，不能在解构赋值的 pattern 后指定类型注释。

因为这是 ES6 的重命名语法，如果想指定解构后的对象的属性的类型可以对整个解构赋值指定类型注释。

```ts
function a({ shape: Shape }) {
    run(shape); // Cannot find name 'shape'. Did you mean 'Shape'?
}

function a({ shape }: { shape: Shape }) {}
```

### readonly

我们知道在 ts 中可以使用 readonly 来指定对象是只读的，但这只是确保了对象本身只读，我们仍然可以修改它的属性的值。

```ts
interface Home {
    readonly resident: { name: string; age: number };
}
function visitForBirthday(home: Home) {
    home.resident.age++;
}

function evict(home: Home) {
    // 不能修改 resident 本身
    home.resident = {
        name: "Victor the Evictor",
        age: 42
    };
}
```

另外， ts 在类型检查时只考虑对应类型的结构，而不考虑其是否是 readonly ，下面的代码并不会报错。

```ts
interface Person {
    name: string;
    age: number;
}

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

let writablePerson: Person = {
    name: "Person McPersonface",
    age: 42
};

let readonlyPerson: ReadonlyPerson = writablePerson;
console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```

### 指定对象的索引签名

有时我们并不清楚一个对象的属性的名称，但是知道通过属性返回的值的类型，这时候可以通过索引签名来描述可能的值类型。

```ts
interface StringArray {
    [index: number]: string;
}
const myArray: StringArray = getStringArray();
const secondItem = myArray[1]; // string
```

另外，我们知道 js 中可以通过 `number` 类型的下标来访问一个数组，而数组本身也是一个对象。js 在通过 `number` 类型来访问值时，实际上将 `number` 转为了 `string` 再进行访问，这就意味着使用 `number` 进行索引和使用 `string` 进行索引是同一回事。

ts 允许我们对两种类型的索引方式制定索引签名，但 `number` 类型的索引签名必须是 `string` 类型索引返回的类型的子类型或者相同。

```ts
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

interface NotOkay {
    [x: string]: Dog;
    // 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
    [x: number]: Animal;
}
```

并且，使用了字符串签名后，之后其他的属性的返回类型必须与字符串签名的返回类型相匹配（子类，联合类型的部分或完全相同）。

```ts
interface Test {
    [index: string]: Object;
    length: [];
    name: [];
}

// 如果想用 Array 来表示，需要指定泛型的类型
interface Test {
    [index: string]: Object;
    length: Array<number>;
    name: Array<string>;
}

// 使用联合类型的值时可以接收不同类型的属性
interface NumberOrStringDictionary {
    [index: string]: number | string;
    length: number;
    name: string;
}
```

最后，可以指定索引签名为 `readonly` 来防止通过索引赋值。

### 扩展属性字段

通过 `extends` 我们可以在任何 `interface` 的基础上扩展任何我们想要的成员属性。通过这样可以复用 `interface` 减少代码量。当然它也可以基于多个不同的基类型扩展。

```ts
interface BasicAddress {
    name?: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
    unit: string;
}
```

### 交叉类型

如果我们想要一个结合两个 `interface` ，并得到一个一定包括这两个 `interface` 都具有的属性，这时候我们可以使用 `interface` 的交叉集别名。

```ts
interface Colorful {
    color: string;
}
interface Circle {
    radius: number;
}

type ColorfulCircle = Colorful & Circle;

// function draw(circle: ColorfulCircle) {  // 这个也可以
function draw(circle: Colorful & Circle) {
    console.log(`Color was ${circle.color}`);
    console.log(`Radius was ${circle.radius}`);
}

draw({ color: "blue", radius: 42 });
// missing in type '{ color: string; }'
draw({ color: "red" });
```

虽然交叉集和 extends 扩展看似没有多大区别，但这两者在处理冲突上并不相同，我们往往会因为它处理冲突的方式不同来选择两者。

### 泛型对象类型

如果一个属性值我们想让它为任何类型，你可能会想到使用 `any` ，但是在一些情况下它可能会导致错误，我们可以用 `unknown` 来替换 `any` ，但是这需要在知道属性的类型的情况时通过 `as` 断言来预防。

你可能也会想到将类型分裂开，通过多个 `interface` 以及函数重载来实现，但这是不大合理的，因为这样增加了工作量，并且在之后如果要新增新的类型，这是无法实现的。

为了解决这个方法，我们可以使用泛型，并且在指定对象类型时传入这个属性的值。通过泛型可以减少我们使用函数重载（当然某些场景必须使用重载），我们可以通过泛型定义自己的类型接口，通过一个类型别名来使用也是一样的，不过类型别名还能写出一个各种的 泛型帮助类型 。

```ts
interface Box<Type> {
    content: Type;
}
type Box<Type> = {
    content: Type;
};
// 我们可以把 Type 当做一个占位符，并且它会被其他类型替换。
let box: Box<string>;
```

```ts
type orNull<Type> = Type | null;
type oneOrMany<Type> = Type | Type[];
type oneOrManyNull<Type> = orNull<oneOrMany<Type>>;
type oneOrManyOrNullStrings = oneOrManyNull<string>;
```

### ReadonlyArray

用于表示一个不应更改的数组，对其本身或内容进行更改都不行，这与 `readonly` 修饰符类似，并且 `ReadonlyArray` 不是一个构造函数。

```ts
function doStuff(values: ReadonlyArray<string>) {
    const copy = values.slice();
    console.log(`The first value is ${values[0]}`);
    values.push("hello!");
}

// 上面这个写法与下面这个写法相同
function doStuff(values: readonly string[]) {
    const copy = values.slice();
    console.log(`The first value is ${values[0]}`);
    values.push("hello!");
}
```

### 元组类型

元组类型是特定的元素个数，以及哪些位置是哪些类型。

```js
function doSomething(pair: [string, number]) {
    const a = pair[0];
    const b = pair[1];
}
doSomething(["hello", 42]);
```

数组也是一种对象，因此我们可以写出索引版的数组类型声明。

```ts
interface StringNumberPair {
    length: 2;
    0: string;
    1: number;
    slice(start?: number, end?: number): Array<string | number>;
}
```

元组也可以使用可选符号，在想要可选的类型后添加一个 `?`，并且它也会影响 `length` 属性。

```ts
type Either2dOr3d = [number, number, number?];
function setCoordinate(coord: Either2dOr3d) {
    const [x, y, z] = coord; // const z: number | undefined
    console.log(`Provided coordinates had ${coord.length} dimensions`);
    // (property) length: 2 | 3
}
```

元组中也能使用剩余参数，它必须是 数组/元组 类型 ，并且带有剩余参数的元组没有固定的“长度”，只是用于划分不同的位置的类型。

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

元组类型常常被用于 剩余参数和 arguments ，我们一般这样使用它。并且，我们也可以对元组添加 readonly。

```ts
function readButtonInput(...args: [string, number, ...boolean[]]) {
    const [name, version, ...input] = args;
}

// 这和上面是等价的
function readButtonInput(name: string, version: number, ...input: boolean[]) {}

// readonly
function doSomething(pair: readonly [string, number]) {
    pair[0] = "hello!"; // Cannot assign to '0' because it is a read-only property.
}
```

我们应该尽可能将类型注释为一个元组类型，因为这样带有断言的数组文字将使用元组类型 `const` 进行推断。

```ts
let point = [3, 4] as const;
function distanceFromOrigin([x, y]: [number, number]) {
    return Math.sqrt(x ** 2 + y ** 2);
}
// Argument of type 'readonly [3, 4]' is not assignable to parameter of type '[number, number]'.
// The type 'readonly [3, 4]' is 'readonly' and cannot be assigned to the mutable type '[number, number]'.
distanceFromOrigin(point);
```

我们发现 distanceFromOrigin 从未修改传入的参数，但是类型注释是一个可变的元组。由于 point 的类型是被推断为 readonly 的，所以它将不会与 `[number, number]` 一致，因为这个这个类型不能保证 point 的元素是不可变的。

### 索引访问类型

我们也可以通过多个索引的方式来访问 **类型对象** 上的某个属性的类型，并且只能通过指定索引的方式来获取类型，不能使用变量或者属性的引用来获取索引。

```ts
typeof Person = {
  age: number;
  name: string;
  alive: boolean;
}

type p1 = Person['age'];
type p2 = Person['age' | 'name'];
type p3 = Person[keyof Person];

type aliveAName = 'alive' | 'name';
type p4 = Person[aliveAName];

// cannot be used as an index type
// 'key' refers to a value, but is being used as a type here
const key = "age";
type Age = Person[key];

// 你可以使用一个 type 别名作为索引
type key = 'age';
type Age = Person[key];
```

对于元组类型，我们可以用 `number` 占位符来获取数组的子项，并结合 `typeof` 获取子项的类型。

```ts
const array = [
    { name: "bob", age: 15 },
    { name: "alice", age: 25, male: true }
];

/*
type Person = {
    name: string;
    age: number;
    male?: undefined;
} | {
    name: string;
    age: number;
    male: boolean;
}
*/
type Person = typeof array[number];
type Age = typeof MyArray[number]["age"]; // number
type Age = Person["name"]; // string
```

## Classes

### 字段

-   [strictPropertyInitialization](https://www.typescriptlang.org/tsconfig#strictPropertyInitialization)

    配置控制在类中是否需要在构造函数初始化，我们需要在构造函数中初始化，因为 ts 并不会分析由构造函数调用的方法来检测初始化，因为子类有可能会覆盖这些方法从而导致无法初始化成员。但是你可能会想在除了构造函数以外的地方初始化，这时候可以使用 **赋值断言运算符，`!`**

    ```ts
    class BadGreeter {
        name: string;
        // Property 'name' has no initializer and is not definitely assigned in the constructor.
    }

    class GoodGreeter {
        name: string;
        constructor() {
            this.name = "hello";
        }
    }

    class OKGreeter {
        // Not initialized, but no error
        name!: string;
    }
    ```

-   `readonly`

我们可以使用 `readonly` 修饰符作为前缀，防止除了构造函数之外的地方对属性赋值

### 构造函数

类的构造函数与普通函数类似，也可以实现添加带有类型注释的参数，默认值和重载：

```ts
class Point {
    constructor(x: number, y: string);
    constructor(s: string);
    constructor(xs: any = 0, y?: any) {
        // TBD
    }
}
```

类构造函数签名和函数签名有些差异：

-   构造函数不能有 类型参数 ，它们属于外部声明
-   构造函数不能有返回类型注释(返回的总是实例本身)

**Super Calls**

在 js 中如果有一个基类，我们可以在构造函数体中，在使用 `this.` 访问成员 之前调用 `super()`。并且如果我们继承了一个基类，并忘记调用了 `super()` ，ts 会提示我们。

```ts
class Base {
    k = 4;
}
class Derived extends Base {
    constructor() {
        // Prints a wrong value in ES5; throws exception in ES6
        console.log(this.k);
        // 'super' must be called before accessing 'this' in the constructor of a derived class.
        super();
    }
}
```

### 方法

类上的一个**函数属性**就是一个方法。方法可以使用所有与函数和构造函数相同的类型注释，并且 ts 没有为方法添加其他任何东西，并且在方法体内如果想访问对象上的某一属性或其他方法仍然需要通过 `this.`。

像下面这个例子，我们其实想修改实例上的属性 x ，但是没有通过 `this` 进行访问，访问到了类外的变量 x ，所以是赋值的类型出错。

```ts
let x: number = 0;

class C {
    x: string = "hello";

    m() {
        // This is trying to modify 'x' from line 1, not the class property
        x = "world";
        // Type 'string' is not assignable to type 'number'.
    }
}
```

### Getters/Setters

我们知道对象可以设置 getter / setter ，class 也是类似的，我们一般只要在要处理其他逻辑时才会用到 getter / setter ，如果没有额外的逻辑，可以直接当做属性使用。

ts 内部对 getter / setter 会有一些特殊的推理规则：

-   如果存在 get 但没有 set ，则属性默认为 `readonly`
-   如果不指定 setter 参数的类型，则会自动从 getter 的返回值判断
-   getter / setter 必须具有相同的 [成员可见性](https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility)

### 索引签名

Class 也可以声明索引签名，这与对象的索引签名也是相似的，不过我们一般将索引数据存储在其他地方而不是实例本身，因为索引签名也会将方法的类型给捕获到。

```ts
class MyClass {
    [s: string]: boolean | ((s: string) => boolean);

    check(s: string) {
        return this[s] as boolean;
    }
}
```

### 类继承

#### `implements` 从句

我们可以使用一个 `implements` 从句来 **校验** 类是否满足一个指定的 `interface` ，它不会改变类的类型或类的方法，class 也可以 `implement` 多个 `interface`，通过 ',' 间隔。

```ts
interface Pingable {
    ping(): void;
}
class Sonar implements Pingable {
    ping() {
        console.log("ping!");
    }
}
class Ball implements Pingable {
    pong() {
        // 'Ball' incorrectly implements interface 'Pingable'
        console.log("pong!");
    }
}
```

#### `extends` Clauses

和 js 的 extends 相同，子类实例会有父类所有的属性和方法。

```ts
class Animal {
    move() {
        console.log("Moving along!");
    }
}

class Dog extends Animal {
    woof(times: number) {
        for (let i = 0; i < times; i++) {
            console.log("woof!");
        }
    }
}

const d = new Dog();
d.move();
d.woof(3);
```

**Overriding Methods**

子类也可以覆盖基类的属性或者方法，并且在派生类中通过 `super.` 来访问父类的方法

```ts
class Base {
    greet() {
        console.log("Hello, world!");
    }
}

class Derived extends Base {
    greet(name?: string) {
        if (name === undefined) {
            super.greet();
        } else {
            console.log(`Hello, ${name.toUpperCase()}`);
        }
    }
}

const d = new Derived();
d.greet();
d.greet("reader");
```

但像下面这种情况，子类的方法不符合父类的同名方法，就会出错

```ts
class Base {
    greet() {
        console.log("Hello, world!");
    }
}

class Derived extends Base {
    greet(name: string) {
        // Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
        //   Type '(name: string) => void' is not assignable to type '() => void'.
        console.log(`Hello, ${name.toUpperCase()}`);
    }
}
```

#### 仅对类型字段声明

在 ES2022 以上的版本或设置了 [useDefineForClassFields](https://www.typescriptlang.org/tsconfig#useDefineForClassFields) 为 true ，属性将在父类构造调用完成后初始化，这样会导致子类相同名字的属性的值覆盖父类属性的值。如果我们想在子类重新声明这个继承来的属性为一个更加精确的类型，这时候就需要借助 `declare` 用告诉 ts 这个声明在运行时无效的，不会参数属性的声明。

```ts
interface Animal {
    dateOfBirth: any;
}

interface Dog extends Animal {
    breed: any;
}

class AnimalHouse {
    resident: Animal;
    constructor(animal: Animal) {
        this.resident = animal;
    }
}

class DogHouse extends AnimalHouse {
    declare resident: Dog; // 这仅仅只是为了声明一个更加精确的类型，不会影响运行时的代码
    constructor(dog: Dog) {
        super(dog);
    }
}
```

#### 初始化顺序

```ts
class Base {
    name = "base";
    constructor() {
        console.log("My Name is " + this.name);
    }
}
class Derived extends Base {
    name = "derived";
}
const derived = new Derived(); // My Name is base
```

js 的类初始化顺序如下：

-   base class 字段被初始化
-   base class 构造函数运行
-   derived class 字段被初始化
-   derived class 构造函数运行

这就是为什么输出的是 base 而不是 derived ，因为 derived 类的 name 这时候还未初始化。

在 ES2015 中，具有一个返回对象的构造函数，会隐式地将其 this 的值替换为任意 `super()` 的调用者，生成这个构造函数的代码会捕获 `super()` 任何潜在的返回值，并用它替换 this。

因此，`Error`，`Array` 的子类可能不能像预期那样工作，这是由于构造函数为 `Error`、`Array` ，并且可能使用 es6 的 `new.target` 来调整原型链；但是在 es5 中调用构造函数时不能确保 `new.target` 的值存在，其他低版本的编译器也同样有默认的限制。

在下面这个子类中，你可能会发现

-   子类构造出来的对象上的方法会是 undefined ，因此调用时会导致错误
-   子类和子类实例之间的 `instanceof` 被破坏，因此 `(new MsgError()) instanceof MsgError` 将返回 `false`

这时候就需要我们在 `super()` 调用完后手动调整原型，并且 `MsgError` 的子类也同样需要手动调整原型，但是在 ie10 及更早的版本中，这种方式也不能有效工作，我们可以手动从原型上复制方法到实例本身，但原型链将被不能被修复。

```ts
class MsgError extends Error {
    constructor(m: string) {
        super(m);

        // set the prototype explicitly
        Object.setPrototypeOf(this, MsgError.prototype);
    }
    sayHello() {
        return `hello ${this.message}`;
    }
}
```

### 成员可见性

为了支持面向对象的语法，ts 内部也集成了方法和属性的可见性，通过 `public` 、`protected`、`private` 修饰符。

#### `public`

`public` 修饰的成员属性或方法，对类的实例可见，并且当我们未添加任何修饰符时默认就是 `public` 修饰，但我们可能有自己的代码风格，又或是为了代码可读性会选择编写 `public`。

#### `protected`

`protected` 修饰的成员仅在 该类本身和该类的子类的声明区内 可见，这个类和它的子类的实例并不能访问类中用 `protected` 修饰成员。

```ts
class Greeter {
    public greet() {
        console.log(`Hello, ${this.getName()}`);
    }
    protected getName() {
        return "hi";
    }
}

class SpecialGreeter extends Greeter {
    public howdy() {
        console.log("Howdy, " + this.getName()); // success to access protected menber
    }
}
const g = new SpecialGreeter();
g.greet();
g.getName(); //error,'getName' is protected and only accessible within class 'Greeter' and its subclasses.（只允许在Greeter和它的子类内部访问）
```

**跨层次的 protected 访问**

不同的 OOP 语言对于通过基类引用访问 `protected` 成员存在分歧，ts 认为在基类中通过基类的引用访问基类中 `protected` 修饰的属性是不合法的

```ts
class Base {
    protected x: number = 1;
}
class Derived1 extends Base {
    protected x: number = 5;
}
class Derived2 extends Base {
    f1(other: Derived2) {
        other.x = 10; // 因为继承了基类的属性，所以它身上是具有 x 属性的，并且继承下来的会是 protected 类型，但是由于是在子类内部访问，所以是允许的
    }
    f2(other: Derived1) {
        // 'x' is protected and only accessible within class 'Derived1' and its subclasses
        other.x = 10;
    }
    fB(other: Base) {
        // 'x' is protected and only accessible through an instance of class 'Derived2'. This is an instance of class 'Base'
        other.x = 10;
    }
}
new Derived2().x; // 'x' is protected and only accessible within class 'Base' and its subclasses
```

由上面我们能够发现 Derived2 中的属性 x 只能在 Derived2 类和它的子类中访问，在类外通过实例的引用进行访问时无效的（因为继承了 protected 修饰符）。

Derived1 的属性 x 也是相同的，所有 f2 函数中是访问不到的，Base 是 Derived1 和 Derived2 的基类，我们也不能访问它的 protected 修饰的属性 x ，但是它的的错误提示信息和访问 Derived1 的错误提示信息又是不同的，它会建议通过 Derived2 的实例来访问，正如 f1 所示。

#### `private`

`private` 类似于`protected` ，但不允许从子类访问父类成员属性。

因为 private 成员对子类不可见，所有子类不能增加父类 `private` 属性的可见性。

```ts
class Base {
    private x = 0;
}
class Derived extends Base {
    // Class 'Derived' incorrectly extends base class 'Base'. Property 'x' is private in type 'Base' but not in type 'Derived'
    x = 1;
}
```

**跨实例 private 访问**

不同 OOP 语言对于同一类的不同实例是否可以访问彼此的 `private` 成员存在分歧。ts 允许跨实例 `private` 访问：

```ts
class A {
  private x = 10;
  public sameAs(other: A) {
    return other.x ==== this.x;
  }
}
```

**注意：**

`private` 和 `protected` 仅仅是在类型检查阶段是有效的，运行时将会是无效的我们仍然可以通过 in 或者属性来访问`private` 和 `protected` 属性

并且即使是在代码检查阶段，我们也可以同 属性名表达式 的方式来访问私有属性。

```ts
class MySafe {
    private secretKey = 12345;
}
const s = new MySafe();
console.log(s.secretKey); // 'secretKey' is private and only accessible within class 'MySafe'.
console.log(s["secretKey"]); // ok
```

js 中有 `#` 可以真正实现属性的私有，编译和运行时都是私有的。

当编译到 ES2021 或更低版本时，TypeScript 将使用 Wea​​kMaps 代替 `#` ，如果我们不想让类中的某个属性的值被恶意修改，我们可以通过闭包、 WeakMap 或私有字段的方式来隐藏，不会这可能会影响性能。

### 静态成员

类的 [静态成员](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static) 与类的实例无关，可以通过类构造函数对象访问，并且静态成员也有成员可见性，即可以通过 `public`、`protected`、`private` 修饰

```ts
class Test {
    private static x = 0;
}
console.log(Test.x); // error，'x' is private and only accessible within class 'MyClass'
```

静态成员也能够被继承：

```ts
class Base {
    static getGreeting() {
        return "hello world";
    }
}
class Derived extends Base {
    myGreeting = Derived.getGreeting();
}
```

#### 特殊的静态名

覆盖函数的属性通常是不 安全/可能 的，因为类本身就是可以被 `new` 调用的函数，所有有些 `static` 名是不能使用的。比如函数的 `name`、`length` 属性，并且 `call` 也不是一个有效的 `static` 成员。

```ts
class S {
    static name = "s!"; // 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
}
```

#### ts 为什么没有静态类？

ts 没有类似于 c# 具有的 `static class` 这样的构造调用。这类型的语言需要所有的数据和方法在一个类内部，而 ts 不存在这样的限制，所以不需要 `static class`。

如果一个类只有一个实例，通常只表示为 js/ts 中的普通对象，我们也不需要 ts 中的 '静态类' 语法，因为常规对象也可以完成这项工作：

```ts
// 无需 'static' 类
class MyStaticClass {
    static doSomething() {}
}

// 可替代的方法 1
function doSomething() {}

// 可替代的方法 2
const MyHelperObject = {
    doSomething() {}
};
```

### 类中的 static 块

静态块允许我们编写一系列有自己的作用域的语句，并且静态块中能访问其所在类内部的私有属性。

我们可以在静态块中编写所有功能的初始化代码，不会导致变量的泄漏，并且具有类内部的所有属性和功能的完全访问权限。

```ts
class Foo {
    static #count = 0;
    get count() {
        return Foo.#count;
    }
    static {
        try {
            const lastInstances = loadLastInstances();
            Foo.#count += lastInstances.length;
        } catch {}
    }
}
```

### 泛型类

类似于 interface ，类也可以使用泛型，当一个泛型类通过 new 实例化时，它的类型参数的推断方式与函数调用中的方式相同，可以通过传入参数判断，又或是手动指定类型。并且它也能够和接口一样，使用泛型约束和默认值：

```ts
class Box<Type> {
    contents: Type;
    constructor(value: Type) {
        this.contents = value;
    }
}

const box1 = new Box("hello!"); // Box<string>
const box2 = new Box(123456); //Box<number>
```

#### 类型参数和静态成员

```ts
class Box<Type> {
    static defaultValue: Type;
    // Static members cannot reference class type parameters.
}
```

在运行时类型总是会被去除，这意味着如果能设置 `Box<string>.defaultValue` 也可以改变为 `Box<number>.defaultValue` 这是不好的。所以，一个泛型类的 `static` 成员不能引用类的类型参数。

### 类中的运行时 `this`

在初次接触 js 时，你会发现 js 中的 this 是不大一样的， 就像下面一样

```ts
class MyClass {
    name = "MyClass";
    getName() {
        return this.name;
    }
}

const c = new MyClass();
const obj = {
    name: "obj",
    getName: c.getName
};
console.log(obj.getName()); // obj
```

你会发现输出的是 obj 而不是 MyClass ，这是一个很奇怪的行为，不过用函数式编程的思想来看，我们通过 c 这个对象拿到了它身上的方法，而将这个方法放在了另一个对象身上，那其实这样就可以理解，为什么输出结果是 obj 了，因为此时就等同于 obj 也有一个 getName 方法，所以调用者自然是 obj。

ts 提供了一些方法来 减轻和阻止 这类错误的发生。

#### 箭头函数

如果你有一个函数，经常以失去 `this` 上下文的方式被调用，那么你可以使用一个箭头函数，而不是一个方法定义

```ts
class MyClass {
  name = 'myclass';
  getName = () => {
    return this.name;
  };
}
const class = new MyClass();
const g = c.getName;
console.log(g()); // myclass
```

使用了箭头函数后，与普通函数有一些区别：

-   this 将始终为初始化时的对象

-   这会耗费更多的内存，因为每个类实例都会有自己的以这种方式定义的函数的副本

-   不能在子类中通过 `super.getName` 获取到，因为原型链中没有入口来获取到基类的方法

#### this 参数

ts 中提供了 this 参数，并且它会在编译期间被删除

```ts
function fn(this: SomeType, x: number) {}
```

ts 会检查是否使用正确的上下文调用带 this 参数的函数，这样我们就无需使用箭头函数，而可以使用 this 参数，在编写代码时迫使方法被正确的调用。

```ts
class MyClass {
    name = "myclass";
    getName(this: MyClass) {
        return this.name;
    }
}
const c = new MyClass();
const g = c.getName;
console.log(g()); // 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass' (“void”类型的“this”上下文不可分配给“MyClass”类型的方法“this”)
```

这会与箭头函数绑定 this 有很大的区别，实际上它是以一个对象的成员方法的形式被调用，只是我们在编译前就迫使函数必须正确调用，并且这时候每个类只分配一个函数，而不是每个实例都有一个，我们仍然可以通过 `super.` 的方式获取方法来调用。

### `this` 类型

在类中，一个名为 this 的特殊类型动态地引用当前类的类型

```ts
class Box {
    contents = "";
    set(value: string) {
        // (method) Box.set(value:string):this
        this.contents = value;
        return this;
    }
}
```

我们可以看到，ts 推断出了 set 方法的返回值是 this ，而不是 Box

```ts
class ClearableBox extends Box {
    clear() {
        this.contents = "";
    }
}
const a = new ClearableBox();
const b = a.set("hello"); // b: ClearableBox
```

从上面这个子类中，我们发现 b 的类型是 ClearableBox 而不是 Box
如果尝试使用 this 作为一个类型注释呢？

```ts
class Box {
    content = "";
    sameAs(other: this) {
        // this 作为类型注释
        return other.content === this.content;
    }
}

class DerivedBox extends Box {
    otherContent = "?";
}
const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base); // error
// Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
// Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'.
```

从第一条错误信息可以看出，sameAs 的参数类型应该是 DerivedBox 而不是 Box；  
从第二条错误信息可以看出，Box 和 DerivedBox 的结构不同比较失败；

所以我们可以总结出 this 作为类型参数是会动态改变的，它取决于方法调用时所属的对象所在类。并且，ts 比较对象类型时，总是比较对象的结构，如果你尝试将 `otherContent = '?'` 修改为 `content = ''` ，你会发现并不报错，这就是 ts 的检测机制。

#### 基于 this 的类型守卫

你可以在 类和接口 中，方法的返回值类型注释处，使用 `this is Type` 。当与一个缩小类型的语句(如，if 语句) 混合使用时，目标对象的类型将被缩小到指定 `Type`。

```ts
class FileSystemObject {
    isFile(): this is FileRep {
        return this instanceof FileRep;
    }
    isDirectory(): this is Directory {
        return this instanceof Directory;
    }
    isNetworked(): this is Networked & this {
        return this.networked;
    }
    constructor(public path: string, private nerworked: boolean) {}
}

class FileRep extends FileSystemObject {
    constructor(path: string, public content: string) {
        super(path, false);
    }
}

class Directory extends FileSystemObject {
    children: FileSystemObject[];
}

interface Networked {
    host: string;
}

const fso: FileSystemObject = new FileRep("bar.txt", "foo");
if (fso.isFile()) {
    console.log(fso.content); //   const fso: FileRep;
} else if (fso.isDirectory()) {
    console.log(fso.children); //  const fso: Directory;
} else if (fso.isNetworked()) {
    console.log(fso.host); //  const fso: Networked & FileSystemObject;
}
```

上面一个例子就是 `this is Type` 配合 if 语句使用的例子，运行后可以发现结果为 'foo' 进了 isFile 的代码段。

基于 this 的类型守卫，允许我们对某一特定属性作惰性的校验。下面这个例子中，当 hasValue 的校验为 true 时，移除了 Box 中 value 属性的 `undefined` 类型

```ts
class Box<T> {
    value?: T;

    hasValue(): this is { value: T } {
        // 主要是因为这里用 this is { value: T } 将 this 限定为 value 属性是必选的
        return this.value !== undefined; // 和这句没有多大关系，只是为了判断
    }
}

const box = new Box();
box.value = "Gameboy";

box.value; // (property) Box<unknown>.value?: unknown

if (box.hasValue()) {
    box.value; //(property) value: unknown
}
```

### 参数属性

ts 提供了自己的语法，用于将构造函数参数转为一个类属性，通过相同的名字和值。它们被叫做 参数属性 ，并且通过给构造函数的参数添加一个 **可见性修饰符前缀** 的方式来创建，最后属性也会获得这些修饰符：

```ts
class Params {
    constructor(public readonly x: number, protected y: number, private z: number) {
        //no body
    }
}
const a = new Params(1, 2, 3);
console.log(a.x);
console.log(a.z); // 'z' is private and only accessible within class 'Params'
```

### 类表达式

类表达式与类的声明相似，唯一的区别在于，类表达式无需类名

```ts
const someClass = class<Type> {
    content: Type;
    constructor(value: Type) {
        this.content = value;
    }
};
const m = new someClass("hello, world");
```

### 抽象类和成员

类似于许多 oop 语言，ts 也有抽象的 class、method、field。

一个抽象的方法或者抽象的属性是不能作为一个工具被提供的。这些成员仅仅在抽象类内部存在，抽象类 **不能直接被实例化** 。

抽象类作为一个基类角色，服务其他所有使所有抽象成员生效的子类。当一个类没有任何抽象成员时，它就是一个具象的类。

```ts
abstract class Base {
    abstract getName(): string;
    printName() {
        console.log(`Hello，${this.getName()}`);
    }
}
const base = new Base(); // 不能为一个抽象类创建实例
```

由 Base 我们创建一个衍生类，并且通过衍生类让所有抽象成员生效：

```ts
class Derived extends Base {
    getName() {
        // 具体化抽象类中的抽象方法
        return "world";
    }
}
const derived = new Derived();
d.printName();
```

如果我们没有在衍生出来的子类让抽象成员生效，将会报错：

```ts
class Derived extends Base {
    // Non-abstract class 'Derived' does not implement inherited abstract member 'getName' from class 'Base'
    // 非抽象类 'Derived' 没有使从 'Base' 类中继承来的抽象成员 'getName' 生效
}
```

#### 抽象构造签名

有时我们会想传入一个类的构造函数，用于生产一个由抽象类衍生出来的类的实例。

```ts
function greet(ctor: typeof Base) {
    // 直接写了 Base ，检测到 Base 是一个抽象类
    const instance = new ctor(); // 不能实例化一个抽象类
    instance.printName();
}
```

ts 会告诉你，你正在尝试实例化一个抽象类。毕竟，依据 `greet` 的定义，编写这段代码是完全合法的，它最终会构造一个抽象类。

相反，我们应该写一个方法可以接受一个构造签名：

```ts
function greet(ctor: new () => Base) {
    const instance = new ctor();
    instance.printName();
}
abstract class Base {
    abstract getName(): string;
    printName() {
        console.log("hello，" + this.getName());
    }
}
class Derived extends Base {
    getName() {
        return "hello";
    }
}
greet(Derived);
greet(Base);
// 'typeof Base' 类型的参数是不能被赋值到 'new () => Base' 类型的参数上
// Argument of type 'typeof Base' is not assignable to parameter of type 'new () => Base'
// 不能赋值一个抽象构造类型到一个非抽象构造类型上
// Cannot assign an abstract constructor type to a non-abstract constructor type
```

现在 ts 会正确的告诉我们类构造函数将被调用，而 `Derived` 类是具象的，因而能被调用成功，`Base` 类则不能

### 类之间的关系

在大多条件下，ts 类只在类结构上进行比较，与其他类型相同。

例如，下面两个类能相互替代，因为它们是相同的：

```ts
class Point1 {
    x = 0;
    y = 0;
}
class Point2 {
    x = 0;
    y = 0;
}
const p: Point1 = new Point2();
```

同样，即使没有显式继承，类之间也存在子类型关系：

```ts
class Person {
    name: string;
    age: string;
}

class Employee {
    name: string;
    age: number;
    salary: number;
}

const person: Person = new Emplyee();
```

这看似不复杂，但也有一些案例似乎比其他案例更奇怪.

空类没有成员。在一个结构类型系统中，一个没有成员的类型通常是其他类型的超类型。因此，如果你写了一个空类（最好不要这样做）。那么我们能用任何东西来替代它：

```ts
class Empty {}
function fn(x: Empty) {
    // nothing
}
fn(window);
fn({});
fn(fn);
```

## Modules

[模块解析策略](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

[ts 命名空间](https://www.typescriptlang.org/docs/handbook/namespaces.html)

[JS 运行时代码降级 target](https://www.typescriptlang.org/tsconfig#target)

[ts 的模块输出选项](https://www.typescriptlang.org/tsconfig#module)

### ts 中的 Module

ts 也对类型指定了类似 ES Module 的语法。

```ts
// @filename：animal.ts
export type Cat = {
    breed: string;
    yearOfBirth: number;
};

export interface Dog {
    breeds: string[];
    yearOfBirth: number;
}

// @filename：app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

ts 使用两个概念声明了一个 类型 的导入，扩展了 `import` 语法。

**import type**

`import type` 是一个只能导入 `type` 的 import 语句

```ts
// @filename：animal.ts
export type Cat = {
    breed: string;
    yearOfBirth: number;
};
export type Dog = {
    breeds: string[];
    yearOfBirth: number;
};
export const createCatName = () => "fluffy";

// @filename：valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;

// @filename：app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
```

上面在 app.ts 中使用了导入类型的语法来导入一个值：函数，会提示不能使用 `import type` 来导入一个值。

**内联 type 导入**

ts 也支持单独的导入，通过添加 `type` 前缀指示导入的是一种类型：

```ts
import { createCatName, type Cat, type Dog } from "./animal.js";
export type Animals = Cat | Dog;
const name = createCatName();
```

这方便了像 Babel、esbuild 或 swc 这样的非 ts 转译器，知道可以安全地删除哪些导入。

**CommonJs 行为的 ES 模块语法**

ts 有与 ES 模块语法 直接相关的 CommonJS 和 AMD 的 `require` ，在大多数情况下，使用 es 模块化的导入与 require 的导入相同，但这种语法确保你的 ts 文件和 CommonJS 输出有一个 1 对 1 的匹配

```ts
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

标识符是被导出通过配置一个全局的 `module` 上的 `exports` 属性。并且这个文件可以被 `require` 导入。

## 其他 type

`void`

void 类型和 undefined 在 typescript 并不是同一回事。

`object`

用于表示所有非原始数据类型的值，与 空对象、全局类型 `Object` 不同，你很有可能从未使用到 `Object`。**object 不是 Object，它总是 object**。Javascript 中的函数值是 objects ，它们有属性，并且 Object.prototype 在他们的原型链上，正是由于这个原因，在 Typescript 中函数类型被认为是 `object` s。

`unknown`

unknown 也表示任意值，它与 `any` 相似，但是它比 `any` 更安全，用 `known` 进行任何操作都是不合法的。

可以用于描述一个不知道返回值类型的函数。

```ts
declare const someRandomString: string;
function safeParse(s: string): unknown {
    return JSON.parse(s);
}
const obj = safeParse(someRandomString);
```

`never`

用于表示值从未被观察。如果是在一个返回类型中，这意味着函数抛出一个错误或中断程序执行。

当条件分发时，`never` 被当做一个空的联合对待，这意味着在分发 `'a' | never` 时，将被缩短为 `'a'`。若想阻止这个行为，需要强制 ts 在分发联合类型前进行评估，可以通过两种方式实现，一个是将 `T` 打入一个元组 `[T]`， 另外是用采用 `T[]` 数组类型。

## ts 严格模式

```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true
    }
}
```

# 进阶篇

[类型体操](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)

[Debugging the TypeScript Codebase](https://blog.andrewbran.ch/debugging-the-type-script-codebase/)

## 简单

## 中等

### Promise.all

```typescript
/*
  20 - Promise.all
  
  ### 题目
  
  键入函数`PromiseAll`，它接受PromiseLike对象数组，返回值应为`Promise<T>`，其中`T`是解析的结果数组。
  
  '''
  const promise1 = Promise.resolve(3);
  const promise2 = 42;
  const promise3 = new Promise<string>((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
  });
  
  // expected to be `Promise<[number, 42, string]>`
  const p = Promise.all([promise1, promise2, promise3] as const)
  '''
*/
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer V> ? (V extends Promise<unknown> ? MyAwaited<V> : V) : never;

declare function PromiseAll<T extends unknown[]>(
    values: readonly [...T]
): Promise<{
    [key in keyof T]: T[key] extends Promise<unknown> ? MyAwaited<T[key]> : T[key];
}>;

declare function Test1<T>(values: T): {
    [K in keyof T]: T[K];
};
const test1 = Test1([1, 2, 3]); // number[]

declare function Test2<T extends any[]>(
    values: readonly [...T]
): {
    [K in keyof T]: T[K];
};
const test2 = Test2([1, 2, 3]); // [number, number, number]

const promiseAllTest1 = PromiseAll([1, 2, 3] as const);
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const);
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)]);
```

[Variadic tuple types](https://github.com/microsoft/TypeScript/pull/39094)
[Variadic tuple types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html)

![](./img/tsSpreadBehavior.png)

### Permutation

[详细解释](https://github.com/type-challenges/type-challenges/issues/614)

```ts
/*
  296 - Permutation
  
  ### 题目
  
  实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型。
  
  '''typescript
  type perm = Permutation<'A' | 'B' | 'C'>; 
  // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
  '''
*/

type MyExclude<T, U> = T extends U ? never : T;

type Permutation<T, K = T> = [T] extends [never] // 条件类型分配，以及 never 作为联合类型的行为
    ? [] // 空联合时，返回空的联合
    : K extends K // 泛型用在条件类型上会发生分配律，所以 K 中每个元素都会被遍历到，并且 K[number] 满足 extends K
    ? [K, ...Permutation<MyExclude<T, K>>] // 从 T 中排除当前的选择，将排除后的联合传入 Permutation ，求排除后的联合的排列
    : [];

import type { Equal, Expect } from "@type-challenges/utils";

type Permutation1 = Permutation<"A">;
type Permutation2 = Permutation<"A" | "B" | "C">;
type Permutation3 = Permutation<"B" | "A" | "C">;
type Permutation4 = Permutation<never>;

type cases = [
    Expect<Equal<Permutation<"A">, ["A"]>>,
    Expect<Equal<Permutation<"A" | "B" | "C">, ["A", "B", "C"] | ["A", "C", "B"] | ["B", "A", "C"] | ["B", "C", "A"] | ["C", "A", "B"] | ["C", "B", "A"]>>,
    Expect<Equal<Permutation<"B" | "A" | "C">, ["A", "B", "C"] | ["A", "C", "B"] | ["B", "A", "C"] | ["B", "C", "A"] | ["C", "A", "B"] | ["C", "B", "A"]>>,
    Expect<Equal<Permutation<never>, []>>
];
```

### Combination

```ts
type String2Union<S extends string> = S extends `${infer F}${infer K}` ? F | String2Union<K> : never;

type Combinations<T extends string, U extends string = T> = [T] extends [never]
    ? ""
    : T extends U
    ? // 模板字符串中的联合类型也具有分布式，`${a}${b}` ，a = 'A'，b = 'B' | 'C' => 'A' | 'AB' | 'AC'
      // | 左边的表示以当前这个为起点的组合，| 右边表示没有当前的组合，如 'A' | 'B' | 'C' => ('A...') | ('...')
      // 从 T 中选出不包含 U 这个元素的剩余联合元素作为下一次分布式联合类型的遍历范围
      `${T}${Combinations<Exclude<U, T>>}` | `${Combinations<Exclude<U, T>>}`
    : "";
```

```ts
type CombinationsByObjectIndex<STR extends string, S extends string = String2Union<STR>> = [S] extends [never]
    ? ""
    : // 1. 构造对象
      // 2. 通过 S （联合类型的索引）来访问到值
      // 注：这里加个空串，是为了只有当前单个字符没有其他字符的情况，如下面 AB ，联合类型会自动得到所有组合
      //     再加上 K in S ，就可以得到不同字符开头的组合
      "" | { [K in S]: `${K}${CombinationsByObjectIndex<never, Exclude<S, K>>}` }[S];

type AB = `${"" | "A"}${"" | "B"}`; // "" | "A" | "B" | "AB"
```

### RemoveIndexSignature

[template literal](https://github.com/type-challenges/type-challenges/issues/3542)

[Other Solution](https://github.com/type-challenges/type-challenges/issues/1371)

```ts
/*
  1367 - Remove Index Signature
  
  ### Question
  
  Implement `RemoveIndexSignature<T>` ,
  exclude the index signature from object types.
  
  For example:
  
  type Foo = {
    [key: string]: any;
    foo(): void;
  }
  
  type A = RemoveIndexSignature<Foo>  // expected { foo(): void }
  
*/

// 本题考查了，mapped type 中的一个重映射 as，通过重映射来排除键（返回never，即可排除）
type RemoveIndexSignature<T> = {
    [key in keyof T as string extends key
        ? // 下面这个写法和上面是不同的
          // [key in keyof T as key extends string
          // 对象中任何键都是 string 类型 ，所以上面永远是 true
          // 而 string extends key 只是排除了 key值 为 string 的情况
          never
        : number extends key
        ? never
        : symbol extends key
        ? never
        : key]: T[key];
};

type RemoveIndexSignatureByTemplateLiteral<T> = {
    // 如果是索引签名，如 string extends 'string' 这为 false
    // 如果是普通的属性，foo extends 'foo' 这为 true
    // 对象的属性本身就是字符串，所以，等价于 'foo' extends 'foo'
    // 因此，只要是字符串字面量，我们就保留键（通过返回本身）
    // 否则，过滤掉这个键，通过返回 never
    [key in keyof T as key extends `${infer keyString}` ? keyString : never]: T[key];
};

import type { Equal, Expect } from "@type-challenges/utils";

type Foo = {
    [key: string]: any;
    foo: () => void;
};

type Bar = {
    [key: number]: any;
    bar(): void; // ts 中函数的简写形式，: 右边是函数返回值
};

type FooBar = {
    [key: symbol]: any;
    foobar(): void;
};

type Baz = {
    bar(): void;
    baz: string;
};

type RemoveIndexSignature1 = RemoveIndexSignature<Foo>;
type RemoveIndexSignature2 = RemoveIndexSignature<Bar>;
type RemoveIndexSignature3 = RemoveIndexSignature<FooBar>;
type RemoveIndexSignature4 = RemoveIndexSignature<Baz>;

type RemoveIndexSignatureByTemplateLiteral1 = RemoveIndexSignatureByTemplateLiteral<Foo>;
type RemoveIndexSignatureByTemplateLiteral2 = RemoveIndexSignatureByTemplateLiteral<Bar>;
type RemoveIndexSignatureByTemplateLiteral3 = RemoveIndexSignatureByTemplateLiteral<FooBar>;
type RemoveIndexSignatureByTemplateLiteral4 = RemoveIndexSignatureByTemplateLiteral<Baz>;

type cases = [
    Expect<Equal<RemoveIndexSignature<Foo>, { foo(): void }>>,
    Expect<Equal<RemoveIndexSignature<Bar>, { bar(): void }>>,
    Expect<Equal<RemoveIndexSignature<FooBar>, { foobar(): void }>>,
    Expect<Equal<RemoveIndexSignature<Baz>, { bar(): void; baz: string }>>,

    Expect<Equal<RemoveIndexSignatureByTemplateLiteral<Foo>, { foo(): void }>>,
    Expect<Equal<RemoveIndexSignatureByTemplateLiteral<Bar>, { bar(): void }>>,
    Expect<Equal<RemoveIndexSignatureByTemplateLiteral<FooBar>, { foobar(): void }>>,
    Expect<Equal<RemoveIndexSignatureByTemplateLiteral<Baz>, { bar(): void; baz: string }>>
];
```

### MinusOne

[somebody1234](https://github.com/type-challenges/type-challenges/issues/2563)
[RThong](https://github.com/type-challenges/type-challenges/issues/8194)

```ts
/*
  2257 - MinusOne
  
  ### 题目
  
  给定一个正整数作为类型的参数，要求返回的类型是该数字减 1。
  
  例如:
  
  type Zero = MinusOne<1> // 0
  type FiftyFour = MinusOne<55> // 54
*/

type Numbers = {
    "1": "0";
    "2": "1";
    "3": "2";
    "4": "3";
    "5": "4";
    "6": "5";
    "7": "6";
    "8": "7";
    "9": "8";
    "0": "9";
};

// 利用递归添加数组的长度，最后长度相同时，通过 [infer F, ...infer Rest] 拿到减一后的长度
// 不过当数值过大时，递归栈会过深，不能根本解决
type MinusOneByRecursion1<T extends number, Target extends number[] = []> = T extends Target["length"] // Target 数组的长度是否和 T 相同
    ? // 长度相同时，运用 [infer F, ...infer Rest] 格式
      Target extends [infer F, ...infer Rest]
        ? Rest["length"] // 拿到 去除一个元素后的长度
        : 0 // 否则长度为 0
    : MinusOneByRecursion1<T, [1, ...Target]>; // 让长度增一位

// 下面这种也是利用了递归的思路，不过在原本递归的基础上对生成指定长度的数组进行了优化
// 1. 将原本的数字转为字符串，并且通过 `${infer F}${infer L}`  取到最高位的字符
// 2. 每次递归 L 的部分，并且将传入的数组 T 的长度 * 10，通过 10 个 ...T 实现
// 3. 用 另一个函数创建指定长度的数组，类似于 MinusOneByRecursion1 中的递归，不过由于传入的是字符串，需要将生成的数组长度 T['length'] 转为字符串即 `${T['length']}`
type LengthToArray<N extends string, T extends any[] = []> = `${T["length"]}` extends N ? T : LengthToArray<N, [1, ...T]>;

type CreateLengthArray<S extends string, T extends any[] = []> = S extends `${infer F}${infer L}` ? CreateLengthArray<L, [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...LengthToArray<F>]> : T;

type MinusOneByRecursion2<T extends number> = CreateLengthArray<`${T}`> extends [infer _, ...infer S] ? S["length"] : never;

import type { Equal, Expect } from "@type-challenges/utils";

type MinusOneByRecursion11 = MinusOneByRecursion1<1>;
type MinusOneByRecursion12 = MinusOneByRecursion1<55>;
type MinusOneByRecursion13 = MinusOneByRecursion1<3>;
type MinusOneByRecursion14 = MinusOneByRecursion1<100>;
type MinusOneByRecursion15 = MinusOneByRecursion1<1101>;

type MinusOneByRecursion21 = MinusOneByRecursion2<1>;
type MinusOneByRecursion22 = MinusOneByRecursion2<55>;
type MinusOneByRecursion23 = MinusOneByRecursion2<3>;
type MinusOneByRecursion24 = MinusOneByRecursion2<100>;
type MinusOneByRecursion25 = MinusOneByRecursion2<1101>;

type cases = [
    Expect<Equal<MinusOneByRecursion1<1>, 0>>,
    Expect<Equal<MinusOneByRecursion1<55>, 54>>,
    Expect<Equal<MinusOneByRecursion1<3>, 2>>,
    Expect<Equal<MinusOneByRecursion1<100>, 99>>,
    Expect<Equal<MinusOneByRecursion1<1101>, 1100>>,

    Expect<Equal<MinusOneByRecursion2<1>, 0>>,
    Expect<Equal<MinusOneByRecursion2<55>, 54>>,
    Expect<Equal<MinusOneByRecursion2<3>, 2>>,
    Expect<Equal<MinusOneByRecursion2<100>, 99>>,
    Expect<Equal<MinusOneByRecursion2<1101>, 1100>>,
    Expect<Equal<MinusOneByRecursion2<2000>, 1999>>
];
```
