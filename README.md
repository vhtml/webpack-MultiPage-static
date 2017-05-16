## 基于webpack的前端工程化开发之多页站点篇（一）

**声明：此文只作为webpack入门学习交流，不作为实际项目参考（基于webpack1.x）。**

在最初接触webpack的较长一段时间里，我（也可能很多人）都觉得webpack是专为单页应用而量身打造的，比如webpack+react、webpack+vue等，都可以近乎完美的解决各种资源的依赖加载、打包的问题。甚至css都是打包在js里去动态添加到dom文档中去。

后来想想，这么好的工具这么好的方案为什么不能用在website（普通的web站点，姑且叫做website吧）中呢？

- 首先对于普通的web站点，我们更倾向于将css独立出来，因为对于website来说，css还是要最先加载出来比较好。

- 再然后js我们也只想加载需要的部分，而不是一个大大的打包了所有js模块的包。

在很多webpack入门级的demo里，无论是单入口的还是多入口的，都没有解决上面两个问题。入门毕竟是入门，要晋级还是只能靠自己。幸运的是，有很多优秀的工程师已为我们铺好了路，让我们在前端工程化的道路上少走很多的弯路。如果你也一样曾迷茫过，请不要走开，希望这里能为你答疑解惑。

好吧，以上通通是废话，接下来上干货。

---

首先开始构建我们的项目目录结构。

#### 初始化项目、安装依赖

使用`npm init`初始化项目就不多说了，生成package.json文件。

使用`npm install plugins --save-dev`安装项目所需依赖。最终package.json的依赖声明如下：

```javascript
"devDependencies": {
  "css-loader": "^0.23.1",
  "extract-text-webpack-plugin": "^1.0.1",
  "file-loader": "^0.8.5",
  "html-loader": "^0.4.3",
  "html-webpack-plugin": "^2.9.0",
  "jquery": "^1.12.0",
  "less": "^2.6.0",
  "less-loader": "^2.2.2",
  "style-loader": "^0.13.0",
  "url-loader": "^0.5.7",
  "webpack": "^1.12.13",
  "webpack-dev-server": "^1.14.1"
}
```

#### 主要目录结构

```
- website
  - src                #代码开发目录
    - css              #css目录，按照页面（模块）、通用、第三方三个级别进行组织
      + page
      + common
      + lib
    + img              #图片资源
    - js               #JS脚本，按照page、components进行组织
      + page
      + components
    + view             #HTML模板
  - dist               #webpack编译打包输出目录，无需建立目录可由webpack根据配置自动生成
    + css                
    + js
    + view
  + node_modules       #所使用的nodejs模块
  package.json         #项目配置
  webpack.config.js    #webpack配置
  README.md            #项目说明
```
> 假如你是一名纯粹的前端工程师，使用webpack构建website的目录结构大概就这样了，当然你也可以根据自己的喜好自由设计目录结构。
>
> 详细的代码全貌可以提前在这里“窥看”——<https://github.com/vhtml/webpack-MultiPage-static>。

目录组织好，我们就可以开始撸代码了。

#### 开发页面

在src/js/page目录下建立index.js文件，在src/view目录下建立index.html文件。入口js和模板文件名对应。

index.js内容如下：

```javascript
//引入css
require("../../css/lib/reset.css")
require("../../css/common/global.css")
require("../../css/common/grid.css")
require("../../css/page/index.less")

$('.g-bd').append('<p class="text">这是由js生成的一句话。</p>')
```

index.html 内容如下：

```xml
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>首页</title>
  <meta name="description" content="基于webpack的前端工程化开发解决方案探索"/>
  <!--
    描述：head中无需再引入css以及facicon，webpack将根据入口JS文件的要求自动实现按需加载或者生成style标签
  -->
</head>
<body>
  <div class="g-hd"></div>
  <div class="g-bd">
    <input type="button" value="弹窗" class="btn">
    <p class="img">
      <img src="../img/4.png" alt="">
    </p>
  </div>
  <div class="g-ft"></div>
  <!--
    描述：body中同样无需单独引入JS文件，webpack会根据入口JS文件自动实现按需加载或者生成script标签，还可以生成对应的hash值
  -->
</body>
</html>
```
就是这样一个简单的HTML模板，我们甚至没有引入任何CSS和JS，通过webpack打包就可以自动帮我们引入。

由于是做website，在此之前相信你对单页应用打包已经有过了解，我就不客气了，再来两个页面压压惊。

about.js:

```javascript
//引入css
require('../../css/lib/reset.css')
require('../../css/common/global.css')
require('../../css/common/grid.css')
require('../../css/page/about.less')

$('#about').html('这是一个关于webpack构建工程的栗子')
```
about.html:

```xml
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>关于</title>
  <meta name="description" content="基于webpack的前端工程化开发解决方案探索"/>
</head>
<body>
  <div class="g-hd"></div>
  <div class="g-bd">
    <div id="about"></div>
  </div>
  <div class="g-ft"></div>
</body>
</html>
```
list.js:

```javascript
//引入css
require('../../css/lib/reset.css')
require('../../css/common/global.css')
require('../../css/common/grid.css')
require('../../css/page/list.less')


var html = ''
for(var i = 0; i < 5; i++){
  html += '<li>列表' + (i + 1) + '</li>'
}

$('#list').html(html);
```

list.html:

```xml
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>列表页</title>
  <meta name="description" content="基于webpack的前端工程化开发解决方案探索"/>
</head>
<body>
  <div class="g-hd"></div>
  <div class="g-bd">
    <ul id="list"></ul>
  </div>
  <div class="g-ft"></div>
</body>
</html>
```

OK，太棒了！！！

#### webpack配置

这里是关键，在webpack.config.js里，我们将进行一些配置，来完成我们的需求，一开始或许有点难理解，但等你真的掌握了，你便会惊呼它的神奇。配置中我写了详细的注释，要想彻底理解，还需多实践，多查阅文档，必要时看看源码，呜呼，学习之路漫漫兮。

```javascript
var path = require('path')
var webpack = require('webpack')
/*
extract-text-webpack-plugin插件，
有了它就可以将你的样式提取到单独的css文件里，
妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/*
html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: { //配置入口文件，有几个写几个
    index: './src/js/page/index.js',
    list: './src/js/page/list.js',
    about: './src/js/page/about.js',
  },
  output: { 
    path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
    publicPath: '/dist/',       //模板、样式、脚本、图片等资源对应的server上的路径
    filename: 'js/[name].js',     //每个页面对应的主js的生成配置
    chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
  },
  module: {
    loaders: [ //加载器，关于各个加载器的参数配置，可自行搜索之。
      {
        test: /\.css$/,
        //配置css的抽取器、加载器。'-loader'可以省去
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader') 
      }, {
        test: /\.less$/,
        //配置less的抽取器、加载器。中间!有必要解释一下，
        //根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
        //你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
        loader: ExtractTextPlugin.extract('css!less')
      }, {
        //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
        //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
        test: /\.html$/,
        loader: "html?attrs=img:src img:data-src"
      }, {
        //文件加载器，处理文件静态资源
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=./fonts/[name].[ext]'
      }, {
        //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
        //如下配置，将小于8192byte的图片转成base64码
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({ //加载jq
      $: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: ['index','list','about'], //提取哪些模块共有的部分
      minChunks: 3 // 提取至少3个模块共有的部分
    }),
    new ExtractTextPlugin('css/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    
    //HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/index.html', //生成的html存放路径，相对于path
      template: './src/view/index.html', //html模板路径
      inject: 'body', //js插入的位置，true/'head'/'body'/false
      hash: true, //为静态资源生成hash值
      chunks: ['vendors', 'index'],//需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //压缩HTML文件  
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    }),
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/list.html', //生成的html存放路径，相对于path
      template: './src/view/list.html', //html模板路径
      inject: true, //js插入的位置，true/'head'/'body'/false
      hash: true, //为静态资源生成hash值
      chunks: ['vendors', 'list'],//需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //压缩HTML文件  
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    }),
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/about.html', //生成的html存放路径，相对于path
      template: './src/view/about.html', //html模板路径
      inject: true, //js插入的位置，true/'head'/'body'/false
      hash: true, //为静态资源生成hash值
      chunks: ['vendors', 'about'],//需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //压缩HTML文件  
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    }),

    new webpack.HotModuleReplacementPlugin() //热加载
  ],
  //使用webpack-dev-server，提高开发效率
  devServer: {
    contentBase: './',
    host: 'localhost',
    port: 9090, //默认8080
    inline: true, //可以监控js变化
    hot: true, //热启动
  }
};
```
好了，完成以上的这些配置之后，执行`webpack`打包命令完成项目打包。

此时，前往/dist/view目录下查看生成的list.html文件，如下：

```xml
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>列表页</title>
  <meta name="description" content="基于webpack的前端工程化开发解决方案探索">
<link rel="shortcut icon" href="/dist/favicon.ico"><link href="/dist/css/vendors.css?02568e631b7717b7149a" rel="stylesheet"><link href="/dist/css/list.css?02568e631b7717b7149a" rel="stylesheet"></head>
<body>
  <div class="g-hd"></div>
  <div class="g-bd">
    <ul id="list"></ul>
  </div>
  <div class="g-ft"></div>
<script src="/dist/js/vendors.js?02568e631b7717b7149a"></script><script src="/dist/js/list.js?02568e631b7717b7149a"></script></body>
</html>
```

可以看到生成的文件除了保留原模板中的内容以外，还根据入口文件list.js的定义，自动添加需要引入CSS与JS文件，以及favicon，同时还添加了相应的hash值。

执行`webpack-dev-server`启动devServer，打开http://localhost:9090/dist/view/index.html就可以进行正常的页面预览了。说明我们的资源路径生成也是没有问题的。

好了，纯静态的webpack前端构建过程就是这样了。然而你可能还有疑问。

- 假如你是个懒人，可能会觉得目前的配置不够智能，每增加一个页面，就得再手动添加入口文件及模板配置。
- 假如你是个全栈工程师或者以nodejs做中间层的开发者，你的模板不是纯粹的html，但是又需要像html模板那样能自动根据需要添加css与js文件。

还等什么，快戳这里吧——[基于webpack的前端工程化开发之多页站点篇（二）](https://github.com/vhtml/webpack-MultiplePage)
