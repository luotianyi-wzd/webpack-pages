const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge')
const common = require('./webpack.common')
const os = require('os');
const config = require('./config')


function getIPAdress(){ //获取本机ip
    var interfaces = os.networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}
const host = getIPAdress();

module.exports = merge(common, {
    output:{
        path:path.resolve(__dirname,'./../dist'),
        filename:'js/[name]-bundle.js',
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    mode:"development",
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer:{
        contentBase:path.resolve(__dirname,'../dist'), //最好设置成绝对路径
        historyApiFallback: false,
        hot: true,
        inline: true,
        stats: 'errors-only',
        host,
        port: config.dev.port,
        overlay: true,
        open:true,
        proxy: config.dev.proxyTable,
    }
})