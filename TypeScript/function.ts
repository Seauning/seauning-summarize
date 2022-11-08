
type SomeConstructor = {
  new (s: string) : void;
}

type ConstructorObj = {
  s : string
}

declare function Constructor (this : ConstructorObj , s : string) {
  this.s = s;
}

function fn (ctor : SomeConstructor) {
  return new ctor('hello');
}

fn(Constructor);

type Reverse<T> = any[] extends T ? T : 222

type C1 = Reverse<number[]>;  // number[]

type C2 = Reverse<any[]>; // any[]

type C3 = Reverse<unknown[]>; // unknown[]

type C4 = Reverse<any[1]>;  // any

