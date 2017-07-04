const path = require('path');
const Uglify = require('uglifyjs-webpack-plugin');

const context = path.resolve(__dirname);

const ENTRY_FILE = path.join(context, 'index.jsx');
const BUILD_DIR = path.join(context, 'dist');


module.exports = {
  context,
  entry: [
    ENTRY_FILE,
  ],
  output: {
    filename: 'index.js',
    path: BUILD_DIR,
    library: 'react-child-window',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /index.jsx/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new Uglify({
      sourceMap: true,
    })
  ]
};
