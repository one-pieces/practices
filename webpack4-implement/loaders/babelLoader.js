const babel = require('@babel/core')
const fs = require('fs')
// const _config = require('../babel.config')
let i = 1

module.exports = (source) => {
  const res = babel.transform(source, {
    sourceType: 'module' // 允许使用 import 和 export 语法
  })
  if (i > 0) {
    fs.writeFileSync('./test.js', res.code)
  }
  i--
  return res.code
}
