var path = require('path')
var webpack = require('webpack')
/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里，
妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin')
/*
html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 配置入口文件，有几个写几个
  entry: {
    index: './src/js/page/index.js',
    list: './src/js/page/list.js',
    about: './src/js/page/about.js'
  },
  output: {
    path: path.join(__dirname, 'dist'), // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
    publicPath: '/dist/',       // 模板、样式、脚本、图片等资源对应的server上的路径
    filename: 'js/[name].js',     // 每个页面对应的主js的生成配置
    chunkFilename: 'js/[id].chunk.js'   // chunk生成的配置
  },
  module: {
    // 加载器，关于各个加载器的参数配置，可自行搜索之。
    loaders: [
      {
        test: /\.css$/,
        // 配置css的抽取器、加载器。'-loader'可以省去
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }, {
        test: /\.less$/,
        // 配置less的抽取器、加载器。中间!有必要解释一下，
        // 根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
        // 你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
        loader: ExtractTextPlugin.extract('css!less')
      }, {
        // html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
        // 比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
        test: /\.html$/,
        loader: 'html?attrs=img:src img:data-src'
      }, {
        // 文件加载器，处理文件静态资源
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=./fonts/[name].[ext]'
      }, {
        // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
        // 如下配置，将小于8192byte的图片转成base64码
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({ // 加载jq
      $: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: ['index', 'list', 'about'], // 提取哪些模块共有的部分
      minChunks: 3 // 提取至少3个模块共有的部分
    }),
    new ExtractTextPlugin('css/[name].css'), // 单独使用link标签加载css并设置路径，相对于output配置中的publickPath

    // HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
    new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
      favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/index.html', // 生成的html存放路径，相对于path
      template: './src/view/index.html', // html模板路径
      inject: 'body', // js插入的位置，true/'head'/'body'/false
      hash: true, // 为静态资源生成hash值
      chunks: ['vendors', 'index'], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      }
    }),
    new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
      favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/list.html', // 生成的html存放路径，相对于path
      template: './src/view/list.html', // html模板路径
      inject: true, // js插入的位置，true/'head'/'body'/false
      hash: true, // 为静态资源生成hash值
      chunks: ['vendors', 'list'], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      }
    }),
    new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
      favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/about.html', // 生成的html存放路径，相对于path
      template: './src/view/about.html', // html模板路径
      inject: true, // js插入的位置，true/'head'/'body'/false
      hash: true, // 为静态资源生成hash值
      chunks: ['vendors', 'about'], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      }
    }),

    new webpack.HotModuleReplacementPlugin() // 热加载
  ],
  // 使用webpack-dev-server，提高开发效率
  devServer: {
    contentBase: './',
    host: 'localhost',
    port: 9090,
    inline: true,
    hot: true
  }
}
