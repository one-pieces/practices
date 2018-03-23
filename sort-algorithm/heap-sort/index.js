// 堆排序，时间复杂度为 O(nlogn)

function heapSort(arr) {
  // 1. 构建大顶堆
  for (var i = Math.floor(arr.length / 2) -1; i >= 0; i --) {
    // 从第一个非叶子结点从下至上，从右至左调整结构
    adjustHeap(arr, i , arr.length);
  }

  // 2. 交换对顶元素与末尾元素 + 调整堆结构
  for (var j = arr.length - 1; j > 0; j--) {
    swap(arr, 0, j);
    adjustHeap(arr, 0, j);
  }
}

function adjustHeap(arr, i, length) {
  var temp = arr[i]; // 先取出当前元素arr[i]的值
  for (var k = i * 2 + 1; k < length; k = k * 2 + 1) { // 从结点I的左子节点开始，循环调整
    if (k + 1 < length && arr[k] < arr[k + 1]) {
      // 如果左子结点小于右子结点，k指向右子节点
      k++;
    }
    if (arr[k] > temp) {
      // 如果子结点大于父结点，将子结点赋值给父结点（现在不需要交换，因为还会循环查询下面的子结点）
      arr[i] = arr[k];
      i = k;
    } else {
      // 否则小于父结点，说明下面的子结点都小于父结点，则跳出循环
      break;
    }
    arr[i] = temp; // 将temp值放到最终的位置
  }
}

function swap(arr, one, other) {
  var temp = arr[one];
  arr[one] = arr[other];
  arr[other] = temp;
}

module.exports = heapSort;
