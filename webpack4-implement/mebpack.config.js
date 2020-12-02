// const HtmlWebpackPlugin = require('html-webpack-plugin')
const BabelLoader = require('./loaders/babelLoader')
const JSXLoader = require('./loaders/JSXLoader')
const TestPlugin = require('./plugins/TestPlugin')
const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  entry: './src/index',
  output: {
    path: resolve('dist'),
    fileName: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          resolve('src')
        ],
        use: {
          loader: BabelLoader
        }
      }
    ]
  },
  plugins: [
    new TestPlugin()
  ]
}
