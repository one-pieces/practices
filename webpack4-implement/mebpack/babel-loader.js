const babel = require('@babel/core')
module.exports = function BabelLoader(source) {
  const res = babel.transform(source, {
    sourceType: 'module' // 编译 ES6 的 import 和 export 语法
  })
  return res.code
}
