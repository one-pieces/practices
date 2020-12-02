const mebpack = require('./mebpack/index.js')

const config = require('./mebpack.config')

mebpack(config, (err) => {
  if (err) {
    console.log('编译出错了')
  }
})
