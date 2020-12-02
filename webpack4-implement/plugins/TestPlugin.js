class TestPlugin {
  apply(compiler) {
    compiler.hook.beforeRun.tapAsync('just4fun', () => {
      console.log('[Success] 开始编译')
    })
  }
}

module.exports = TestPlugin
