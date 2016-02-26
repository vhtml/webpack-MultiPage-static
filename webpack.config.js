var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		index: './src/js/page/index.js',
		list: './src/js/page/list.js',
		about: './src/js/page/about.js',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/dist/',
		filename: 'js/[name].js',
		chunkFilename: 'js/[id].chunk.js'
	},
	module: {
		loaders: [ //加载器
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('css!less')
			}, {
				test: /\.html$/,
				loader: "html"
			}, {
				test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=./fonts/[name].[ext]'
			}, {
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
		new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
			favicon: './src/img/favicon.ico', //favicon路径
			filename: './view/index.html', //生成的html存放路径，相对于path
			template: './src/view/index.html', //html模板路径
			inject: 'body', //js插入的位置，true/'head'/'body'/false
			hash: true, //为静态资源生成hash值
			chunks: ['vendors', 'index'],
			minify: { //压缩HTML文件	
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false //删除空白符与换行符
			}
		}),
		new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
			favicon: './src/img/favicon.ico', //favicon路径
			filename: './view/list.html', //生成的html存放路径，相对于path
			template: './src/view/list.html', //html模板路径
			inject: true, //js插入的位置，true/'head'/'body'/false
			hash: true, //为静态资源生成hash值
			chunks: ['vendors', 'list'],
			minify: { //压缩HTML文件	
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false //删除空白符与换行符
			}
		}),
		new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
			favicon: './src/img/favicon.ico', //favicon路径
			filename: './view/about.html', //生成的html存放路径，相对于path
			template: './src/view/about.html', //html模板路径
			inject: true, //js插入的位置，true/'head'/'body'/false
			hash: true, //为静态资源生成hash值
			chunks: ['vendors', 'about'],
			minify: { //压缩HTML文件	
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false //删除空白符与换行符
			}
		}),
		new webpack.HotModuleReplacementPlugin() //热加载
	],
	devServer: {
		contentBase: './',
		host: 'localhost',
		port: 9090,
		inline: true,
		hot: true,
	}
};