function Instanceof1(left: Object, right: Function): boolean {
  let proto = left.__proto__;
  const prototype = right.prototype;

  while (true) {
    if (proto === null) return false;
    if (prototype === proto) return true;
    proto = proto.__proto__;
  }
}

function Instanceof2(left: object, right: Function): boolean {
  let proto = Reflect.getPrototypeOf(left);
  const prototype = right.prototype;
  while (true) {
    if (proto === null) return false;
    if (prototype === proto) return true;

    proto = Reflect.getPrototypeOf(proto);
  }
}
