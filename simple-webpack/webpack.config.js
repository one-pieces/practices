const path = require('path');

module.exports = {
  entry: './entry.js',
  output: {
    filename: 'entry.js',
    path: path.resolve(__dirname, 'dist')
  }
};