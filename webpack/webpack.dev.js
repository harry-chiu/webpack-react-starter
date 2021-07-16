const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { merge } = require('webpack-merge');
const webpackCommon = require('./webpack.common');

module.exports = merge(webpackCommon, {
  // 開發模式
  mode: 'development',

  // Application 輸出
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  // 優化設定
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  // Plugin 設定
  plugins: [
    // webpack 內建 Hot Reload 插件
    // 開發時不需重新整理頁面即可看到最新畫面
    new HotModuleReplacementPlugin(),

    // webpack-html-plugin 插件
    // 產生 html 至打包後的專案中
    new HTMLWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html'),
    }),

    // circular-dependency-plugin 插件
    // 檢查是否有重複 import 的問題
    new CircularDependencyPlugin({
      exclude: /\.js|node_modules/,
      failOnError: false,
    }),
  ],

  // Dev Server 設定
  devServer: {
    host: 'localhost',
    port: 8080,
    publicPath: '/',
    contentBase: path.resolve(__dirname, '../build'),
    hot: true,
    open: true,
    compress: true,
    historyApiFallback: true,
  },

  // 開發時透過 source-map 更方便的進行 debug
  devtool: 'eval-source-map',

  // 性能相關
  // 只顯示 Error 相關
  performance: {
    hints: 'warning',
  },
});
