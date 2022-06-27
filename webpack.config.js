const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: 'development',
  devtool: isDev ? false : 'eval-cheap-module-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 4001,
    hot: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  performance: {
    hints: 'warning', // 枚举
    maxAssetSize: 30000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
    assetFilter: function (assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(js|ts)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {test: /\.tsx?$/, loader: 'ts-loader'},
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template/index.html',
    }),
    // 模块联邦
    // new ModuleFederationPlugin({
    //   // name: 必须, 唯一 ID, 作为输出的模块名, 使用的时通过 ${name}/${expose} 的方式使用
    //   name: 'app1',
    //   // library: 必须, 其中这里的 name 为作为 umd 的 name
    //   // library: { type: "var", name: "app1" },
    //   // 调用方引用的文件名称
    //   filename: 'app1.js',
    //   // remotes: 可选, 表示作为 Host 时, 去消费哪些 Remote
    //   remotes: {
    //     // '导入别名':'远程应用名称/远程应用地址/导入文件的名称'
    //     app2: `app2@${'http://localhost:4002/app2.js'}`,
    //   },
    //   // exposes: 可选, 表示作为 Remote 时, export 哪些属性被消费
    //   exposes: {},
    //   // shared: 可选, 优先用 Host 的依赖, 如果 Host 没有, 再用自己的
    //   shared: [],
    // }),
  ],
}
