const obj = {
    i: 0,
    get a() {
        const arr = [1, '1'];
        return arr[this.i++];
    }
};
console.log(obj.a);
console.log(obj.a);
