function globalAlphaDraw() {
  const ctx = document.getElementById('globalAlpha').getContext('2d');
  // 画背景
  ctx.fillStyle = '#FD0'
  ctx.fillRect(0,0,75,75)
  ctx.fillStyle = '#6C0'
  ctx.fillRect(75,0,75,75)
  ctx.fillStyle = '#09F'
  ctx.fillRect(0,75,75,75)
  ctx.fillStyle = '#F30'
  ctx.fillRect(75,75,75,75)
  ctx.fillStyle = '#FFF'

  ctx.fill()

  // 设置透明度值
  ctx.globalAlpha = 0.2

  // 画半透明圆
  for (let i=0;i<7;i++){
    ctx.beginPath()
    ctx.arc(75,75,10+10*i,0,Math.PI*2,true)
    ctx.fill()
  }
}

function rgbaDraw() {
  const ctx = document.getElementById('rgba').getContext('2d')

  // 画背景
  ctx.fillStyle = 'rgb(255,221,0)'
  ctx.fillRect(0,0,150,37.5)
  ctx.fillStyle = 'rgb(102,204,0)'
  ctx.fillRect(0,37.5,150,37.5)
  ctx.fillStyle = 'rgb(0,153,255)'
  ctx.fillRect(0,75,150,37.5)
  ctx.fillStyle = 'rgb(255,51,0)'
  ctx.fillRect(0,112.5,150,37.5)

  // 画半透明矩形
  for (let i=0;i<10;i++){
    ctx.fillStyle = 'rgba(255,255,255,'+(i+1)/10+')'
    for (let j=0;j<4;j++){
      ctx.fillRect(5+i*14,5+j*37.5,14,27.5)
    }
  }
}

globalAlphaDraw()
rgbaDraw()
