const path = require('path');
const { HashedModuleIdsPlugin } = require('webpack').ids;
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { merge } = require('webpack-merge');
const webpackCommon = require('./webpack.common');

module.exports = merge(webpackCommon, {
  // 正式環境
  mode: 'production',

  // Application 輸出
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: '/',
  },

  // 優化設定
  optimization: {
    nodeEnv: 'production',
    sideEffects: true,
    runtimeChunk: 'single',
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            inline: 2,
            warnings: false,
            comparisons: false,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },

  // Plugin 設定
  plugins: [
    // webpack-html-plugin 插件
    // 產生 html 至打包後的專案中
    // 進行壓縮
    new HTMLWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html'),
      minify: {
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        removeComments: true,
        useShortDoctype: true,
        keepClosingSlash: true,
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),

    // compression-webpack-plugin 插件
    // 將大於 10kb 的檔案壓縮成 gzip
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html)$/,
      threshold: 1024 * 10,
      minRatio: 0.8,
    }),

    // 將模塊加上 Hash 值
    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),

    // clean-webpack-plugin
    // 打包前移除打包資料夾中的舊檔案
    new CleanWebpackPlugin(),

    // webpack-bundle-analyzer
    // 分析打包後的專案大小
    new BundleAnalyzerPlugin(),
  ],

  // 性能相關
  // 篩選要計算性能的檔案
  performance: {
    hints: 'error',
  },
});
