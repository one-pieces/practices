const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

/**
 * 异步读取文件内容并返回【代码字符串】和【唯一 md5 哈希标识】
 * @param path
 * @returns {Promise<unknown>}
 */
const readFileWithHash = (path) => new Promise((resolve, reject) => {
  // 创建 MD5 哈希对象
  const md5hash = crypto.createHash('md5')
  const stream = fs.createReadStream(path)
  // data 收集代码片段
  let data= ''
  stream.on('data', chunk => {
    // md5 根据文件内容不断更新
    md5hash.update(chunk)
    data += chunk
  });
  stream.on('error', err => reject(err))
  stream.on('end', () => {
    // 生成唯一 MD5 标识
    const md5hashStr = md5hash.digest('hex').toUpperCase()
    // 返回文件代码字符串和哈希值
    resolve([data, md5hashStr])
  })
})

/**
 * 根据用户在代码中的引用生成相对根目录的相对路径
 * @param dirpath
 * @param moduleName
 * @param root
 * @returns {string}
 */
function getRootPath(dirpath, moduleName, root) {
  if (/^[a-zA-Z\$_][a-zA-Z\d_]/.test(moduleName)) {
    // 如果模块名满足一个正则要求，说明引用的是 node 模块
    return './node_modules/' + moduleName
  } else {
    return './' + path.relative(root, path.resolve(dirpath, moduleName))
      + (path.extname(moduleName).length === 0 ? '.js' : '');
  }
}

function completeFilePath (path) {
  try {
    if (!path.endsWith('js')) {
      if (fs.existsSync(path + '.js')) {
        return path + '.js'
      }
      if (fs.existsSync(path + '/index.js')) {
        return path + '/index.js'
      }
      throw new Error(`[error]读取${path}内容时出错`)
    }
    return path
  } catch (e) {
    console.log(e)
  }
}

exports.readFileWithHash = readFileWithHash
exports.getRootPath = getRootPath
exports.completeFilePath = completeFilePath



