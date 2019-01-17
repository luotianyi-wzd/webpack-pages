const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const config = require('./config')

// 配置常量
const ASSETS_BUILD_PATH = config.output.assetsRoot; // 打包后的资源根目录（本地物理文件路径）
const publicPath = config.output.assetsPublicPath  // 资源根目录（可以是 CDN 上的绝对路径，或相对路径）
const jsFileName = config.build.isHash ? 'js/[name]_' + config.output.jsVersion + '.js' : 'js/[name].js'

module.exports = merge(common, {
    output: {
        filename: jsFileName,
        path: ASSETS_BUILD_PATH,
        publicPath,
    },
    plugins: [
        new UglifyJsPlugin(),
        new OptimizeCSSAssetsPlugin({}),
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'),       　　　　　　　　　　//根目录
            verbose: true,        　　　　　　　　　　//开启在控制台输出信息
            dry: config.build.dry        　　　　　　　　　　//启用删除文件false开启
        }),
        // new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
})