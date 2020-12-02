const Compiler = require('./compiler')

function webpack(config, callback) {
  // TODO 参数检验
  const compiler = new Compiler(config)
  // 开始编译
  compiler.run(callback)
}

module.exports = webpack
