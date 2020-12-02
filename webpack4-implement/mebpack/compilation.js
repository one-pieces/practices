const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const generator = require('@babel/generator').default
const {
  readFileWithHash,
  getRootPath,
  completeFilePath
} = require('./utils')

module.exports = class Compilation {
  constructor(props) {
    const {
      entry,
      root,
      loaders,
      hooks
    } = props
    this.entry = entry
    this.root = root
    this.loaders = loaders
    this.hooks = hooks
    this.assets = {}
  }

  moduleMap = {}

  // 开始编译
  async make() {
    await this.moduleWalker(this.entry)
  }

  // dfs 遍历函数
  async moduleWalker(sourcePath) {
    if (sourcePath in this.moduleMap) return
    // 读取文件时，需要完整的以 .js 结尾的文件路径
    sourcePath = completeFilePath(sourcePath)
    console.log('==========', sourcePath)
    const [ sourceCode, md5Hash ] = await this.loaderParse(sourcePath)
    const modulePath = getRootPath(this.root, sourcePath, this.root)
    // 获取模块编译后的代码和模块内的依赖数组
    const [ moduleCode, relyInModule ] = await this.parse(sourceCode, path.dirname(modulePath))
    // 将模块代码放入 ModuleMap
    // this.moduleMap[modulePath] = moduleCode.replace(/\`/g, '\\`')
    this.moduleMap[modulePath] = moduleCode
    this.assets[modulePath] = md5Hash
    // 再依次对模块内的依赖项进行解析
    for (let i = 0; i < relyInModule.length; i++) {
      await this.moduleWalker(relyInModule[i], path.dirname(relyInModule[i]))
    }
  }

  // 使用 loader 编译代码
  async loaderParse(entryPath) {
    // 用 utf8 格式读取文件内容
    let [ content, md5Hash ] = await readFileWithHash(entryPath)
    // 获取用户注入的 loader
    const { loaders } = this
    // 遍历所有的 loaders
    for (let i = 0; i < loaders.length; i++) {
      const loader = loaders[i]
      const { test: reg, use } = loader
      if (entryPath.match(reg)) {
        // 判断是否满足正则或字符串要求
        // 如果该规则需要应用多个 loader，则从最后一个开始向前执行
        if (Array.isArray(use)) {
          while(use.length) {
            const cur = use.pop()
            const loaderHandler = typeof cur.loader === 'string' ? require(cur.loader) :
              typeof cur.loader === 'function' ? cur.loader : _ => _
            content = await loaderHandler(content)
          }
        } else if (typeof use.loader === 'string') {
          const loaderHandler = require(use.loader)
          content = await loaderHandler(content)
        } else if (typeof use.loader === 'function') {
          const loaderHandler = use.loader
          content = await loaderHandler(content)
        }
      }
    }
    return [ content, md5Hash ]
  }

  // 解析源码，替换其中的 require 方法来构建 moduleMap
  async parse(source, dirpath) {
    const that = this
    // 将代码解析成 ast
    const ast = parser.parse(source, {
      // sourceType: 'module',
      // plugins: ['jsx']
    })
    const relyInModule = []  // 获取文件依赖的所有模块
    traverse(ast, {
      // 检索所有的词法分析节点，当遇到函数调用表达式时执行，对 ast 进行修改
      CallExpression(p) {
        if (p.node.callee && p.node.callee.name === '_interopRequireDefault') {
          const innerNode = p.node.arguments[0]
          that.convertNode(innerNode, dirpath, relyInModule)
        } if (p.node.callee.name === 'require') {
          that.convertNode(p.node, dirpath, relyInModule)
        }
      }
    })
    // 将改写后的 ast 重新组装成一份新的代码，并且和依赖项一同返回
    const moduleCode = generator(ast).code
    return [ moduleCode, relyInModule ]
  }

  /**
   * 将某个节点的 name 和 arguments 转换成我们想要的新节点
   */
  convertNode(node, dirpath, relyInModule) {
    node.callee.name = '__webpack_require__'
    // 参数字符串名称，例如 'react' './MyName.js'
    let moduleName = node.arguments[0].value
    // 生成依赖模块相对【项目根目录】的路径
    let moduleKey = completeFilePath(getRootPath(dirpath, moduleName, this.root))
    // 收集依赖 module 数组
    relyInModule.push(moduleKey)
    // 替换 __webpack_require__ 的参数字符串，因为这个字符串也是对应模块的 moduleKey，需要保持统一
    // 因为 ast 树中每一个元素都是 babel 节点，所以需要用 @babel/types 来进行生成
    node.arguments = [ types.stringLiteral(moduleKey) ]
  }
}
