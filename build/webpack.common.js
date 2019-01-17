const webpack = require('webpack')
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");  //分离css，webpack4推荐的分离css的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const glob = require('glob')  //glob，这个是一个全局的模块，动态配置多页面会用得着
const autoprefixer = require('autoprefixer');//给css自动加浏览器兼容性前缀的插件
const config = require('./config')

//动态添加入口
function getEntry() {
    var entry = {};
    //读取src目录所有page入口
    glob.sync('./src/*.js').forEach(function (name) {
        var start = name.indexOf('src/') + 4;
        var end = name.length - 3;
        var eArr = [];
        var n = name.slice(start, end);
        //n = n.split('/')[1];
        eArr.push(name);
        //eArr.push('babel-polyfill');//引入这个，是为了用async await，一些IE不支持的属性能够受支持，兼容IE浏览器用的
        entry[n] = eArr;
    })
    return entry;
}



//动态生成html  获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, chunks) {
    return {
        template: `./src/${name}/${name}.html`,
        filename: process.env.NODE_ENV === 'development' ? `pages/${name}.html` : `${name}.html`,
        inject: true,
        hash: false,
        chunks: [name],
        // favicon: './img/icon.ico',
    }
}
// 配置常量
const cssFileName = config.build.isHash ? 'css/[name].[contenthash].css' : 'css/[name].css'

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.vue']
    },
    entry: getEntry(),
    module: {
        rules: [
            /*{
                enforce: 'pre',  // ESLint 优先级高于其他 JS 相关的 loader
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },*/
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                // 建议把 babel 的运行时配置放在 .babelrc 里，从而与 eslint-loader 等共享配置
                loader: 'babel-loader'
            },
            {
                test:/\.js$/,
                exclude:/(node_modules)/,
                include: /src/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:['@babel/preset-env',],
                            plugins:['@babel/transform-runtime']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../',
                            minimize: true, //压缩
                            plugins: [
                                autoprefixer({
                                    browsers: ['ie >= 8', 'Firefox >= 20', 'Safari >= 5', 'Android >= 4', 'Ios >= 6', 'last 4 version']
                                })
                            ]
                        }
                    },
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use:
                    [
                        {
                            loader: 'url-loader',
                            options:
                                {
                                    limit: 10,
                                    name: 'img/[name].[hash].[ext]'
                                }
                        }
                    ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use:
                    [
                        {
                            loader: 'url-loader',
                            options:
                                {
                                    limit: 8192,
                                    mimetype: 'application/font-woff',
                                    name: 'fonts/[name].[ext]'
                                }
                        }
                    ]
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use:
                    [
                        {
                            loader: 'file-loader',
                            options:
                                {
                                    limit: 8192,
                                    mimetype: 'application/font-woff',
                                    name: 'fonts/[name].[ext]'
                                }
                        }
                    ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../',
                            minimize: true, //压缩
                            plugins: [
                                autoprefixer({
                                    browsers: ['ie >= 8', 'Firefox >= 20', 'Safari >= 5', 'Android >= 4', 'Ios >= 6', 'last 4 version']
                                })
                            ]
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: cssFileName,
            chunkFilename: cssFileName,
        }),
    ],
};

//配置页面
var entryObj = getEntry();
var htmlArray = [];
Object.keys(entryObj).forEach(function (element) {
    htmlArray.push({
        _html: element,
        title: '',
        chunks: [element]
    })
})
//自动生成html模板
htmlArray.forEach(function (element) {
    module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})