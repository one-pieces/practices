// 快速排序，
// 1. 当分区选取的基准元素为待排序元素中的最大或最小值是，为最坏情况，此时时间复杂度为 O(n^2)
// 2. 当分区选取的基准元素为待排序元素中的"中值"，为最好情况，时间复杂度为 O(nlog(2)n)
// 3. 快速排序的控件复杂度为 O(log(2)n)
// 4. 当待排序元素类似[6,1,3,7,3]且基准元素为6时，经过分区，形成[1,3,3,6,7]，两个3的相对位置发生了改变，所以快速排序是一种不稳定排序

function quickSort(data, length, start, end) {
  if (start == end) return;
  var index = partition(data, length, start, end);
  if (index > start) {
    quickSort(data, length, start, index - 1);
  }
  if (index < end) {
    quickSort(data, length, index + 1, end);
  }
}

function partition(data, length, start, end) {
  if (data == null || length <= 0 || start < 0 || end >= length) return;

  // 从start和end之间选取一个基准元素，然后将基准元放到末尾
  var index = Math.floor(Math.random() * (end - start) + start);
  swap(data, index, end);

  // 初始化small，small表示当前元素及之前的元素都小于基准元素
  var small = start - 1;
  for (index = start; index < end; index++) {
    // 如果index的元素小于基准元素，则移动small，
    // 且如果small不等于index，则说明small与index之间有大于或等于基准元素的元素，
    // 此时交换small（此时data[small]大于或等于基准元素）和index（此时data[index]小于基准元素）的元素
    if (data[index] < data[end]) {
      ++small;
      if (small != index) {
        swap(data, small, index);
      }
    }
  }
  ++small;
  swap(data, small, end);
  return small;
}

function swap(arr, one, other) {
  var temp = arr[one];
  arr[one] = arr[other];
  arr[other] = temp;
}

module.exports = quickSort;
