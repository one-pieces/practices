function lineWidthDraw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  for (let i = 0; i < 10; i++){
    ctx.lineWidth = 1+i;
    ctx.beginPath();
    ctx.moveTo(5+i*14,5);
    ctx.lineTo(5+i*14,140);
    ctx.stroke();
  }
}

function lineCapDraw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  const lineCap = ['butt','round','square'];

  // 创建路径
  ctx.strokeStyle = '#09f';
  ctx.beginPath();
  ctx.moveTo(10,210);
  ctx.lineTo(140,210);
  ctx.moveTo(10,340);
  ctx.lineTo(140,340);
  ctx.stroke();

  // 画线条
  ctx.strokeStyle = 'black';
  for (let i=0;i<lineCap.length;i++){
    ctx.lineWidth = 15;
    ctx.lineCap = lineCap[i];
    ctx.beginPath();
    ctx.moveTo(25+i*50,210);
    ctx.lineTo(25+i*50,340);
    ctx.stroke();
  }
}

function lineJoinDraw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  const lineJoin = ['round', 'bevel', 'miter'];
  ctx.lineWidth = 10;
  for (let i = 0; i < lineJoin.length; i++) {
    ctx.lineJoin = lineJoin[i];
    ctx.beginPath();
    ctx.moveTo(195, 5 + i * 40);
    ctx.lineTo(235, 45 + i * 40);
    ctx.lineTo(275, 5 + i * 40);
    ctx.lineTo(315, 45 + i * 40);
    ctx.lineTo(355, 5 + i * 40);
    ctx.stroke();
  }
}

function miterLimitDraw() {
  const ctx = document.getElementById('miterLimitDraw').getContext('2d');

  // 清空画布
  ctx.clearRect(0, 0, 150, 150);

  // 绘制参考线
  ctx.strokeStyle = '#09f';
  ctx.lineWidth   = 2;
  ctx.strokeRect(-5, 50, 160, 50);

  // 设置线条样式
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 10;

  // 检查输入
  if (document.getElementById('miterLimit').value.match(/\d+(\.\d+)?/)) {
    ctx.miterLimit = parseFloat(document.getElementById('miterLimit').value);
  } else {
    alert('Value must be a positive number');
  }

  // 绘制线条
  ctx.beginPath();
  ctx.moveTo(0, 100);
  for (let i = 0; i < 24 ; i++) {
    const dy = i % 2 === 0 ? 25 : -25;
    ctx.lineTo(Math.pow(i, 1.5) * 2, 75 + dy);
  }
  ctx.stroke();
  return false;
}

const ctx = document.getElementById('setLineDash').getContext('2d');
let offset = 0;

function setLineDashDraw() {
  ctx.clearRect(0,0, 500, 500);
  ctx.setLineDash([4, 2]);
  ctx.lineDashOffset = -offset;
  ctx.strokeRect(10,10, 100, 100);
}

function march() {
  offset++;
  if (offset > 16) {
    offset = 0;
  }
  setLineDashDraw();
  setTimeout(march, 20);
}

march();

lineWidthDraw()
lineCapDraw()
lineJoinDraw()
miterLimitDraw()
