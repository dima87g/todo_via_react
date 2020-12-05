const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './static/js/main.js',
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'bundle.js'
  },
  // optimization: {
  //   minimize: false
  // },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
                ['@babel/preset-env'],
                ["@babel/preset-react"],
            ]
          }
        }
      }
    ]
  }
};