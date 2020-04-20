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
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.

        externals: {
            'AMap': 'AMap',
            'AMapUI': 'AMapUI'
        }
    }
}
