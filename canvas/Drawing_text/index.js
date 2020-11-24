function draw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = "48px serif";
  ctx.fillText("Hello world", 10, 50);
}

function strokeTextDraw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = "48px serif";
  ctx.strokeText("Hello world", 10, 250);
}

function measureTextDraw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  const text = ctx.measureText('Hello world'); // TextMetrics object
  console.log(text); // 16;
}

draw()
strokeTextDraw()
measureTextDraw()
