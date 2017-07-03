const path = require('path');
const webpack = require('webpack');

const context = path.resolve(__dirname);

const ENTRY_FILE = path.join(context, 'index.jsx');
const BUILD_DIR = path.join(context, 'dist');


module.exports = {
  context,
  entry: [
    'babel-polyfill',
    ENTRY_FILE,
  ],
  output: {
    filename: 'index.js',
    path: BUILD_DIR,
  },
  module: {
    rules: [
      {
        test: /\.jsx/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
};
