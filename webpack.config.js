const path = require('path');
const { argv } = require('process');
let out = null;

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    out = 'static/builds/dev';
  } else if (argv.mode === 'production') {
    out = 'static/builds/prod';
  }
  return {
    devtool: 'source-map',
    entry: './static/js/main.js',
    output: {
      path: path.resolve(__dirname, out),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
            include: path.resolve(__dirname, 'static/js'),
            exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            }
          }
        }
      ]
    }
  }
};