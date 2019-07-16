function gameOfMarbles(n, s) {
  if (n === 0) return
  let sum = 0
  for (let i = 0; i < s.length; i++) {
    sum += s[i]
    for (let j = 0; j < i; j++) {
      sum += s[i] * Math.pow(2, j)
    }
  }

  return sum
}

const result = gameOfMarbles(10, [3, 3 ,3,3, 3 ,3,3, 3 ,3,3])
console.log('result: ', result)