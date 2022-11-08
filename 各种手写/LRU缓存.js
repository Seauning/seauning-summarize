class Cache {
  constructor(n) {
    this.cache = new Map();
    this.timers = new Map();
    this.size = n;
    this.lifetime = 1000;
  }

  get (id) {
    if (!this.cache.has(id)) return null; // 不存在了直接返回

    const object = this.cache.get(id);     // 拿到旧的 object

    clearTimeout(this.timers.get(id));     // 存在，删除旧的

    this.cache.delete(id);                // 存在，删除旧的

    this.setTimer(id, this.lifetime);     // 从新设置定时器

    this.cache.set(id, object);            // 往缓存中重新添加

    return object;
  }

  set (id, object) {
    if (this.cache.has(id)) {
      clearTimeout(this.timers.get(id)); // 删除旧的
      this.cache.delete(id);            // 删除旧的
    }

    /* 我给这样写了，猪逼啊
      1. 这样的写法忘记更新 obj.object  
      2. object 的优先级没有更新
      const obj = this.cache.get(id)  
      obj.timeid = null;
      obj.timeid = setTimeout(() => {
        this.cache.delete(id);
        obj.timeid = null;
      }, this.lifetime)
      this.cache.set(id, obj);
    */

    this.cache.set(id, object);     // 设置新的
    this.setTimer(id, this.lifetime); // 设置新的

    if (this.cache.size > this.size) {      // 超出了最大容量
      const _id = this.cache.keys().next().value;
      clearTimeout(this.timers.get(_id));  // 删除旧的
      this.cache.delete(_id);             // 删除头部移除的对象
    }
  }

  setTimer (id, lifetime) {
    this.timers.set(id, setTimeout(() => {
      this.cache.delete(id);
    }, lifetime))
  }

}

class Cache {
  constructor(n) {
    this.cache = new Map();
    this.size = n;
    this.lifetime = 1000;
  }

  get (id) {
    if (!this.cache.has(id)) return null;

    const obj = this.cache.get(id);

    this.cache.delete(id);        // 删除后更新，这里也忘了删除，我是 sb

    if (obj.oldTime < Date.now()) return null;

    this.cache.set(id, {
      object: obj.object,
      oldTime: Date.now() + this.lifetime
    });

    return obj.object;
  }

  set (id, object) {
    if (this.cache.has(id)) {
      this.cache.delete(id);
    }

    this.cache.set(id, {
      object,
      oldTime: Date.now() + this.lifetime
    })

    if (this.cache.size > this.size) {      // 超出了最大容量
      const _id = this.cache.keys().next().value;
      this.cache.delete(_id);
    }

  }
}