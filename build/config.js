var path = require('path')

var isProduction = process.env.NODE_ENV === 'production'
var jsVersion = 'r20190114'

if (process.env.NODE_ENV === 'development') { // 开发环境
    var envRoot = 'dev'
    var assetsPublicPath = '/'
} else if (process.env.NODE_ENV === 'local') { // 本机打包测试环境
    var envRoot = 'local'
    var assetsPublicPath = './'
} else if (isProduction) { // 生产环境
    var envRoot = 'prod'
    var assetsPublicPath = 'https://yunlingsir.com/web/'
}

module.exports = {
    output: {
        jsVersion: jsVersion,
        envRoot: envRoot,
        assetsRoot: path.join(__dirname, '../dist', envRoot), // 输出目录
        assetsPublicPath: assetsPublicPath, // 资源地址
    },
    dev: {
        port: 9999,
        devtool: 'inline-source-map',
        cssSourceMap: false,
        cacheBusting: false,
        proxyTable: {
            '/api': {
                target: 'http://192.168.2.192:8080/supfront/',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            }
        }
    },
    build: {
        isHash: isProduction || false, // 先false：223、199，再true：223、199、build，再改回false
        productionSourceMap: false,
        dry: false //false清除dist文件夹内容
    }
}