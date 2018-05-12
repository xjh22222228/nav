const path = require('path');

module.exports = {
  port: 8889,
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'bundle.js'
  }
};