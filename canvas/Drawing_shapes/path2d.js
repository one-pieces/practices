function draw() {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  const rectangle = new Path2D()
  rectangle.rect(10, 10, 50, 50)

  const circle = new Path2D()
  circle.moveTo(125, 35)
  circle.arc(100, 35, 25, 0, 2 * Math.PI)

  const svg = new Path2D('M10 100 h 80 v 80 h -80 Z')

  ctx.stroke(rectangle)
  ctx.fill(circle)
  ctx.stroke(svg)
}

draw()
