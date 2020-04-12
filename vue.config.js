let proxyObj = {};

proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8085',
    changeOrigin: true,
    pathRewrite: {
        '^/':''
    }
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}
