const src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606221113781&di=fcbfd5dd20ba4ec615c2aa5fd120c038&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F27%2F67%2F01300000921826141299672233506.jpg';

function draw() {
  const ctx = document.getElementById('canvas').getContext('2d');
  const img = new Image();
  img.onload = function(){
    ctx.drawImage(img,0,0, 500, 500);
    ctx.beginPath();
    ctx.moveTo(30,96);
    ctx.lineTo(70,66);
    ctx.lineTo(103,76);
    ctx.lineTo(170,15);
    ctx.stroke();
  }
  img.src = src;
}

function scalingDraw() {
  const ctx = document.getElementById('scalingDraw').getContext('2d');
  const img = new Image();
  img.onload = function(){
    for (let i=0;i<4;i++){
      for (let j=0;j<3;j++){
        ctx.drawImage(img,j*50,i*38,50,38);
      }
    }
  };
  img.src = src;
}

function slicingDraw() {
  const canvas = document.getElementById('scalingDraw');
  const ctx = canvas.getContext('2d');

  // Draw slice
  ctx.drawImage(document.getElementById('source'),
    233,71,304,124,221,20,287,104);

  // Draw frame
  ctx.drawImage(document.getElementById('frame'),200,0);
}

draw()
scalingDraw()
slicingDraw()
