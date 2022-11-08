/**
 * 深拷贝
 */

// 1.
// JSON.parse(JSON.stringify(obj))
// JSON.stringify：undefined -> null；function(){} -> null
// JSON.parse：null -> null；undefined -> 报错；NaN -> 报错
// JSON.stringify({a: NaN, b: Infinity}) -> {a: null, b: null}


// 2、递归深拷贝
// 封装函数
function deepCopy (obj, hash = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const { constructor } = obj;
  // 考虑函数、正则、日期、哈希、集合
  if (/^(Function|RegExp|Date|Map|Set)$/i.test(constructor.name))
    return new constructor(target);

  if (hash.has(obj)) {
    return hash.get(obj);
  }
  hash.set(obj, obj);
  let tmp = Array.isArray(obj) ? [] : {};
  for (let key of Reflect.ownKeys(obj)) {
    tmp[key] = deepCopy(obj[key], hash);
  }
  return tmp;
};

let obj1 = {
  a: 1,
  b: [1, 2, function () { console.log(obj1); }],
  c: {
    a: 3
  },
  [BigInt(0)]: 'c'
}
obj1.d = obj1;
let obj2 = deepCopy(obj1);
obj2.b[2]();

/**
 * 虚拟DOM转真实DOM
 */

function produce (tree) {
  // 如果是数字类型转换为字符串,走下一个if
  if (typeof tree === 'number') {
    tree = String(tree);
  }
  // 如果是字符串类型生成并返回文本节点
  if (typeof tree === 'string') {
    return document.createTextNode(tree);
  }
  // 否则生成一个结点继续递归
  let node = document.createElement(tree.tag);
  if (tree.attrs) {
    for (let key in tree.attrs) {
      node.setAttribute(key, tree.attrs[key])
    }
  }
  if (tree.children) {
    for (let child of tree.children) {
      node.appendChild(produce(child))
    }
  }
  return node;
}

// [{id:2, pid: 1}, {id: 1}, {id:3, pid: 2}, {id:4, pid: 3}]
// 双重循环版本
/*
function listToTree (list) {
  const tree = [];
  for (let node of list) {
    if (node.pid) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === node.pid) {
          if (!list[i].child) {
            list[i].child = [node]
          } else {
            // 实则是利用了引用类型的特性
            // 当 push 到这个数组中时
            // tree中相应的引用也会发生改变，因为指向的是同一个地址
            list[i].child.push(node);
          }
        }
      }
    } else {
      tree.push(node);
    }
  }
  return tree;
}
console.log(JSON.stringify(listToTree(list)));
*/

// map 优化版本，没测试过不知道有没有问题
function listToTree (list) {
  const tree = [];
  const hash = new Map(); // hash 中应该存放子节点数组
  for (let i = 0; i < list.length; i++) {
    const node = list[i];
    if (node.pid) {  // 如果这是个子节点
      if (hash.has(node.pid)) {
        // 该父节点存在子节点数组
        // 1.有可能是子节点添加的，这种情况父节点上并没有相应的引用，所以加入到 hash 中临时的子节点数组中
        // 2.也有可能是父节点自己添加的，这种情况父节点上有相应的引用，所以 push 到 hash 中相当于 push 到父节点的 child 中
        hash.get(node.pid).push(node);
      } else {
        // 该子节点的父节点不存在子节点数组
        // 初始化父节点的子节点数组
        hash.set(node.pid, [node]);
      }
    } else {  // 这是个根节点
      tree.push(node);  // 根节点直接推入就行了
    }
    if (hash.has(node.id))  // 先前已经遍历到了我的子节点
      node.child = hash.get(node.id);
    else {                // 先前没有遍历到我的子节点
      node.child = [];    // 记住，保留引用关系很重要
      hash.set(node.id, node.child);  // 这里保存的是一个引用关系需要重视
    }
  }
  return tree;
}

const list = [
  { id: 5, pid: 2 },
  { id: 4, pid: 3 },
  { id: 3, pid: 2 },
  { id: 2, pid: 1 },
  { id: 1 },
  { id: 6, pid: 3 },
  { id: 10, pid: 1 },
  { id: 7, pid: 6 }  // 最后这种，孤立的节点，是会消失的
]

console.log(JSON.stringify(listToTree(list)));


// 真实 DOM 转 json 数据
export function dom2json (dom) {

  function domJson (dom) {
    var obj = {
      tag: getTagName(dom)
    }
    if (dom.nodeType == 1) {  // 普通节点
      var attrs = getTagAttrs(dom)
      if (attrs) obj.attributes = attrs;
      obj.children = Array.from(dom.childNodes).filter(child => {
        return !(child.nodeType === 3 && !child.textContent.trim())
      }).map(child => domJson(child))
      return obj
    }
    if (dom.nodeType == 3) {  // 文本节点
      // 拿到处理后的文本节点内容
      obj.content = texthandle(dom.textContent)
      return obj
    }
  }

  function texthandle (str) {
    // \s 匹配一个空白字符，包括空格、制表符、换页符和换行符
    return str.replace(/\s/g, '')
  }

  function getTagName (dom) {
    // 将标签名转为小写，并替换掉首字母的 #
    // 文本节点和注释节点开头为 #
    return dom.nodeName.toLowerCase().replace('#', '')
  }

  function getTagAttrs (dom) {
    // 拿到所有标签属性，并将这个类数组对象转换为数组
    // 拿到的数组是一个具有所有属性映射的数组
    var attrs = Array.from(dom.attributes)
    var obj = {}
    // attribute.name 拿到属性名、attribute.value 拿到属性值
    attrs.forEach(attr => obj[attr.name] = attr.value)
    // 属性列表可能为空
    return attrs.length ? obj : null;
  }
  return domJson(dom)
}

// 依据员工关系列表得到 JSON 格式上下级关系
const nums = [[1, 5], [2, 6], [5, 6], [6, -1], [4, -1], [5, 2], [7, 4], [8, 5]];

function getRelationRecursion (nums) {
  function relationListToRelationTreeRecursion (boss, nums) {
    const subs = [];
    for (let i = 0; i < nums.length; i++) {
      if (nums[i][1] === boss) {
        const obj = {
          id: nums[i][0],
          subs: relationListToRelationTreeRecursion(nums[i][0], nums) // 当前员工的 subs
        }
        subs.push(obj); // 上级的 subs
      }
    }
    return subs;
  }

  const res = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i][1] === -1) {
      const obj = {
        id: nums[i][0],
        subs: relationListToRelationTreeRecursion(nums[i][0], nums)
      }
      res.push(obj);
    }
  }
  console.log();
  console.log(JSON.stringify(res));
}
getRelationRecursion(nums);

// emmmm 这题和节点数组生成树不大一样，列表里的关系是元组，而不是对象，
// 所有我们需要手动创建对象，保留引用关系
function getRelationMap (nums) {
  const res = [];
  // 我们总是通过 hash 来保留自己的 subs ，无论是 boss 还是 员工
  const hash = new Map();
  for (let i = 0; i < nums.length; i++) {
    const obj = {
      id: nums[i][0]
    }

    // 负责推入 subs 以及，将 boss 推入 res
    if (nums[i][1] === -1) {  // 碰到没有boss的员工，加入结果集
      res.push(obj);
    } else {                  // 碰到的是普通员工
      if (!hash.get(nums[i][1])) { // 父级还没碰到，初始化
        hash.set(nums[i][1], [obj]);
      } else {                     // 父级已经碰到了，推入
        hash.get(nums[i][1]).push(obj)
      }
    }

    // 以下负责添加 subs ，无论是 boss 还是普通员工
    if (hash.has(nums[i][0])) {

      // 我之前已经有员工被找到并且托管在 hash 中
      // 现在我想把我的员工加到 res 相对应与我自己身上的 subs 处
      // 但是遍历 res 又是一个递归的过程，所有我们应该在之前遍历到自己时保留引用关系
      // 我们通过 hash 保留了自己的 subs，这样之后添加新的员工，都能够直接加进来
      // 实际上，我通过 hash 拿到的也是一个引用，所有我不必担心这次赋值之后
      // 再推入后续员工时会丢失
      obj.subs = hash.get(obj.id);

    } else {

      // 我之前还没有员工被保留在 hash 中，因为如果有 员工 了的话， hash 是会有我的 subs 的

      // 为了防止之后会碰到我的员工，我得在 hash 中添加一下我身上的引用，这样之后碰到我的员工
      // 都可以通过这个引用加进来
      obj.subs = [];
      hash.set(nums[i][0], obj.subs);
    }
  }
  console.log();
  console.log(JSON.stringify(res));
  // 可能我们会想着只有有自己的员工时才会添加 subs
  // 但如果要借助引用关系来优化，这是不可能做到的
  // 因为我们不能确保后面有没有自己的员工，所以我们一定需要留着一个通道在 hash 上
  // 这样就算后面有员工，员工也可以通过保留在 hash 上的通道加入进来
}

getRelationMap(nums);

// 属性取值器
function getAttrValue (obj, key) {
  if (!obj || !key) return;
  const keys = key.split('.');
  for (let key of keys) {
    if (!obj[key]) return undefined
    obj = obj[key];
  }
  return obj;
}

getAttrValue({ a: { b: { c: 1 } } }, 'a.b.c')