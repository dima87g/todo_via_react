const path = require('path');

module.exports = {
  entry: './static/js/compiled/main_compiled.js',
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'bundle.js'
  },
  optimization: {
    minimize: false
  }
};