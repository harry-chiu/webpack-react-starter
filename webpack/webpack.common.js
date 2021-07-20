const path = require('path');
const { DefinePlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  // Application 入口
  entry: path.resolve(__dirname, '../src/index.js'),

  // Application 輸出
  output: {
    // 輸出到此路徑
    path: path.resolve(__dirname, '../build'),

    // 若專案路徑不在 origin 的時候就需要設定
    // 詳細可參考：https://harry-chiu.gitbook.io/front-end-note/webpack/path-and-publicpath
    publicPath: '/',
  },

  // 目標設定
  target: 'web',

  // Loader 設定
  module: {
    rules: [
      // style-loader/css-loader
      // 編譯此專案的 css 檔案
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },

      // style-loader/css-loader
      // 編譯第三方套件的 css 檔案
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },

      // file-loader
      // 編譯字體檔案
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },

      // image-webpack-loader/url-loader
      // 處理圖片資源
      //
      // [注意：執行順序為 image-webpack-loader url-loader]
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        use: [
          {
            // url-loader
            // 壓縮後圖檔小於 8 kb 時轉為 base64
            loader: 'url-loader',
            options: {
              limit: 1024 * 8,
            },
          },
          {
            // image-webpack-loader
            // 編譯及壓縮圖片
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV === 'production' ? false : true,
              // JPEG 優化
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // PNG 優化
              optipng: {
                enabled: false,
              },
              // PNG 優化
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              // GIF 優化
              gifsicle: {
                interlaced: false,
              },
              // WEBP 優化
              webp: {
                quality: 75, // 配置選項表示啟用 WebP 優化器
              },
            },
          },
        ],
      },

      // html-loader
      // 編譯 HTML
      {
        test: /\.html$/,
        use: 'html-loader',
      },

      // url-loader
      // 編譯 mp4/webm 音源檔
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 10,
          },
        },
      },
    ],
  },

  // 插件設定
  plugins: [
    // Workbox 插件
    new InjectManifest({
      swSrc: path.resolve(__dirname, '../src/service-worker.js'),
    }),

    // 全域變數 插件
    new DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV),
    }),

    // Copy 插件
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public/icon.png'),
          to: path.resolve(__dirname, '../build/icon.png'),
        },
        {
          from: path.resolve(__dirname, '../public/manifest.json'),
          to: path.resolve(__dirname, '../build/manifest.json'),
        },
      ],
    }),
  ],

  // Webpack 路徑相關設定
  resolve: {
    // import 時前往 node_modules 或 src 尋找
    modules: ['node_modules', 'src'],

    // import 時遇到 js/jsx 不需加副檔名
    extensions: ['.js', '.jsx'],
  },
};
