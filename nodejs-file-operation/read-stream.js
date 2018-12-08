const fs = require('fs');
const file = fs.createReadStream('./message.txt', { start: 3, end: 18 });
file.on('open', function () {
  console.log('开始读取文件。');
});
file.on('data', function (data) {
  console.log('读取到数据：', data.toString());
  console.log(data)
});
file.on('end', function () {
  console.log('文件已全部读取完毕。');
});
file.on('close', function () {
  console.log('文件被关闭。');
});
file.on('error', function (err) {
  console.log('读取文件失败。', err);
});
