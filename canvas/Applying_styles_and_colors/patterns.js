function draw() {
  const ctx = document.getElementById('canvas').getContext('2d');

  // 创建新 image 对象，用作图案
  const img = new Image();
  img.src = 'https://mdn.mozillademos.org/files/222/Canvas_createpattern.png';
  img.onload = function() {
    // 创建图案
    const ptrn = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = ptrn;
    ctx.fillRect(0, 0, 150, 150);

  }
}

draw()
