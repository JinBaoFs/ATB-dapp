const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://103.143.231.82:8090', // 将请求代理到的目标地址
      changeOrigin: true, // 为true时，服务器将会收到来自代理服务器的请求，而不是来自浏览器的请求
      pathRewrite: {
        '^/api': '' // 可选的，重写请求路径
      }
    })
  );
};