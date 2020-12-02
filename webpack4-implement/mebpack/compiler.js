const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const { AsyncSeriesHook } = require('tapable') // 创建异步钩子
const lodash = require('lodash')

const resolve = path.resolve
const Compilation = require('./compilation')
const {
  getRootPath
} = require('./utils')

module.exports = class Compiler {
  constructor(config) {
    const {
      entry,
      output,
      module,
      plugins
    } = config
    // 入口
    this.entryPath = entry
    // 输出文件路径
    this.distPath = output.path
    // 输出文件名
    this.distName = output.fileName
    // 需要使用的 loader
    this.loaders = module.rules
    // 需要挂载的 plugin
    this.plugins = plugins
    // 根目录
    this. root = process.cwd()
    // 编译工具类 Compilation
    this.compilation = {}
    // 入口文件在 module 中的相对路径，也是这个模块的 id
    this.entryId = getRootPath(this.root, entry, this.root)

    this.hook = {
      // 生命周期
      beforeRun: new AsyncSeriesHook(['compiler']), // compiler代表我们将向回调事件中传入一个compiler参数
      afterRun: new AsyncSeriesHook(['compiler']),
      beforeCompile: new AsyncSeriesHook(['compiler']),
      afterCompile: new AsyncSeriesHook(['compiler']),
      emit: new AsyncSeriesHook(['compiler']),
      failed: new AsyncSeriesHook(['compiler']),
    }

    this.mountPlugin()
  }

  // 注册所有 plugin
  mountPlugin() {
    for (let i = 0; i < this.plugins.length; i++) {
      const item = this.plugins[i]
      if ('apply' in item && typeof item.apply === 'function') {
        // 注册各生命周期钩子的发布订阅监听事件
        item.apply(this)
      }
    }
  }

  //
  async run(callback) {
    try {
      // 在特定的生命周期发布消息，触发对应的订阅事件
      this.hook.beforeRun.callAsync(this) // this 作为参数传入，对应之前的 compiler
      this.compilation = new Compilation({
        entry: this.entryPath,
        root: this.root,
        loaders: this.loaders,
        hooks: this.hook
      })
      await this.compilation.make()
      this.emitFile()
      callback(null, this)
    } catch (e) {
      callback(e)
    }
  }

  /**
   * 读取缓存文件信息
   */
  getStorageCache() {
    const cachePath = resolve(this.distPath, 'manifest.json')
    if (fs.existsSync(cachePath)) {
      const asset = require(cachePath, 'utf8')
      return asset || null
    } else {
      return null
    }
  }

  /**
   * 发射文件，生成最终的 bundle.js
   */
  emitFile() {
    // 发射打包后的输出结果文件
    // 首先对比缓存判断文件是否变化
    const assets = this.compilation.assets
    const pastAssets = this.getStorageCache()
    if (lodash.isEqual(assets, pastAssets)) {

    } else {
      // 缓存未命中
      // 获取输出文件路径
      const outputFile = path.join(this.distPath, this.distName)
      // 获取输出文件模板
      const templateStr = fs.readFileSync(path.join(__dirname, 'template.ejs'), 'utf8')
      // 渲染输出文件模板
      const code = ejs.render(templateStr, { entryId: this.entryId, modules: this.compilation.moduleMap })

      this.assets = {}
      this.assets[outputFile] = code
      // 将渲染后的代码写入文件中
      // 将缓存信息写入缓存文件
      if (!fs.existsSync(this.distPath)) {
        fs.mkdirSync(this.distPath, true)
      }
      fs.writeFile(outputFile, this.assets[outputFile], function (e) {
        if (e) {
          console.log('[Error] ' + e)
        } else {
          console.log('[Success] 编译成功')
        }
      });
      fs.writeFileSync(resolve(this.distPath, 'manifest.json'), JSON.stringify(assets, null, 2));
    }
  }
}
