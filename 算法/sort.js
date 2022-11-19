function insertSort (arr) {
  const n = arr.length
  for (let i = 1; i < n; i++) {
    let tmp = arr[i]
    let j = i - 1;
    while (j >= 0 && arr[j] > tmp) { // 将新加入的元素放入到合适位置，找到第一个小于等于它的元素放它后面
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = tmp
  }
  return arr
}

function swap (arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j]
  arr[j] = tmp
}

function selectSort (arr) {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    let pos = i
    for (let j = i; j < n; j++) { // 找到最小的元素
      if (arr[pos] > arr[j]) {
        pos = j
      }
    }
    if (i !== pos) {  // 交换位置
      swap(arr, i, pos)
    }
  }
  return arr
}

function propagationSort (arr) {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n - i; j++) {
      if (arr[j] < arr[j - 1]) {  // 前面的大于后面的交换位置，每次确定一位最大数
        swap(arr, j, j - 1)
      }
    }
  }
  return arr
}

function shellSort (arr) {
  console.log(arr);
  const n = arr.length
  let gap = Math.floor(n / 2)
  while (gap > 0) {
    for (let i = gap; i < n; i++) { // shell 算法是插入排序的一个改进，通过大步长先进行比较，再到小步长进行比较，通过这样的方式较少小步长时需要比较的次数
      let tmp = arr[i]
      let j = i - gap
      while (j >= 0 && arr[j] > tmp) { // 左边的元素大于右边的元素，让右边的元素变为左边的元素，一直变将更大的元素换到右边
        arr[j + gap] = arr[j]
        j -= gap  // 每次 while 都会以 gap 为步长,递减进行比较(插入排序的步长为 1 )
      }
      arr[j + gap] = tmp  // 将小元素放的最后一次变换的位置
    }
    // console.log(arr);
    gap = Math.floor(gap / 2) // 每次步长大小除以 2 
  }
  return arr
}

const merge = (left, right) => {
  const result = [];
  while (left.length && right.length) {
    // 注意: 判断的条件是小于或等于，如果只是小于，那么排序将不稳定.
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  while (left.length) result.push(left.shift());
  while (right.length) result.push(right.shift());
  return result;
};

function mergeSort (arr) {
  //采用自上而下的递归方法
  const len = arr.length;
  if (len < 2) {
    return arr;
  }
  // length >> 1 和 Math.floor(len / 2) 等价
  let middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle); // 拆分为两个子数组
  return merge(mergeSort(left), mergeSort(right));
};

function quickSort (arr) {
  const n = arr.length
  const sort = (s, e) => {
    if (s >= e) return; // 窗口缩到最小，这时候就没必要再找了，否则会一直递归
    const base = arr[s] // 分界元素
    let i = s, j = e;
    while (i < j) {
      while (base <= arr[j] && i < j) j--  // j 是分界元素右侧开始，第一个小于分界元素的元素下标
      arr[i] = arr[j]
      while (base >= arr[i] && i < j) i++  // i 是分界元素左侧开始，第一个大于分界元素的元素下标
      arr[j] = arr[i]
    }
    arr[i] = base;  // 这里如果为 i ，这下面两个 sort 是相对 i 缩小，如果为 j 就相对 j 缩小
    sort(s, i - 1)
    sort(i + 1, e)
  }
  sort(0, n - 1)
}

function heapSort (arr) {
  const n = arr.length;
  let heapSize = arr.length - 1;
  // 构造大顶堆
  const getMaxHeap = (arr, i, heapSize) => {
    let l = i * 2 + 1;  // 它的左儿子
    let r = i * 2 + 2;  // 它的右儿子
    let largest = i;    // 记录父节点的两个子节点中最大一个
    if (l <= heapSize && arr[l] > arr[largest]) {
      largest = l;
    }
    if (r <= heapSize && arr[r] > arr[largest]) {
      largest = r;
    }
    if (largest !== i) {  // 将最大的那个换到父节点位置
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      // 这个主要在下沉后的重新找堆顶元素会用到
      getMaxHeap(arr, largest, heapSize); // 从最大值开始下沉
    }
  }

  // 初始化大顶堆
  const initMaxHeap = (arr, heapSize) => {
    // 利用了完全二叉树的性质，完全二叉树的节点只能是 2n 个
    // 而每一个`右结点`的父节点的下标值为 n/2-1
    // 将 i 值初始化为第一个末尾节点
    for (let i = (n >> 1) - 1; i >= 0; i--) {
      getMaxHeap(arr, i, heapSize);
    }
  }
  initMaxHeap(arr, heapSize);

  // 执行大顶堆的堆顶值下沉
  while (heapSize) {  // 没有必要到 0 哈
    // 与堆顶元素交换
    // 将堆顶值换到末尾
    [arr[heapSize], arr[0]] = [arr[0], arr[heapSize]];
    heapSize--; // 缩小下一次需要查找的堆范围
    getMaxHeap(arr, 0, heapSize);
  }
}

function countingSort (arr) {
  let n = arr.length - 1
  let bucket = new Array(n + 1),
    sortedIndex = 0,
    arrLen = arr.length,
    bucketLen = n + 1;

  for (let i = 0; i < arrLen; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }

  for (let j = 0; j < bucketLen; j++) {
    while (bucket[j] > 0) {
      arr[sortedIndex++] = j;
      bucket[j]--;
    }
  }

  return arr;
}

function bucketSort (arr, bucketSize) {
  if (arr.length === 0) {
    return arr;
  }

  let i;
  let minValue = arr[0];
  let maxValue = arr[0];
  for (i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];                //输入数据的最小值
    } else if (arr[i] > maxValue) {
      maxValue = arr[i];                //输入数据的最大值
    }
  }

  //桶的初始化
  let DEFAULT_BUCKET_SIZE = 5;            //设置桶的默认数量为5
  bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
  let bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  let buckets = new Array(bucketCount);
  for (i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }

  //利用映射函数将数据分配到各个桶中
  for (i = 0; i < arr.length; i++) {
    buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
  }

  arr.length = 0;
  for (i = 0; i < buckets.length; i++) {
    insertSort(buckets[i]);                      //对每个桶进行排序，这里使用了插入排序
    for (let j = 0; j < buckets[i].length; j++) {
      arr.push(buckets[i][j]);
    }
  }

  return arr;
}

function radixSort (arr, maxDigit) {
  let counter = [];
  let mod = 10;
  let dev = 1;
  for (let i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
    for (let j = 0; j < arr.length; j++) {
      let bucket = parseInt((arr[j] % mod) / dev);
      if (counter[bucket] == null) {
        counter[bucket] = [];
      }
      counter[bucket].push(arr[j]);
    }
    let pos = 0;
    for (let j = 0; j < counter.length; j++) {
      let value = null;
      if (counter[j] != null) {
        while ((value = counter[j].shift()) != null) {
          arr[pos++] = value;
        }
      }
    }
  }
  return arr;
}

let arr = [6, 2, 4, 1, 3, 4, 11, 6, 5]
arr = [7, 4, 6, 2, 3, 8]
arr = [5, 1, 1, 2, 0, 0]

// insertSort(arr);
// selectSort(arr);
// propagationSort(arr)
// shellSort(arr)
// arr = mergeSort(arr)
quickSort(arr)
// heapSort(arr)
// countingSort(arr)
// bucketSort(arr)
// radixSort(arr, 3)
console.log(arr);
