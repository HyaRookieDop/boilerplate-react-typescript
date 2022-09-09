const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)

module.exports = ({ env }) => {
  return {
    eslint: {
      enable: false,
    },
    // style: {
    //   postOptions: {
    //     plugins: [require("postcss-simple-vars"), require("postcss-nested")], // Additional plugins given in an array are appended to existing config.
    //   },
    // },
    webpack: {
      plugins: {
        add: [
          new WindiCSSWebpackPlugin({
            virtualModulePath: 'src',
            server: {
              port: 9999,
              host: 'localhost',
            },
          }),
          // new WebpackBar({
          //   name: env !== 'production' ? '正在启动' : '正在打包',
          //   color: '#fa8c16',
          //   profile: true,
          // }),
          // new SemiWebpackPlugin({
          //   theme: '@semi-bot/semi-theme-strapi',
          //   include: '~@semi-bot/semi-theme-strapi/scss/local.scss',
          // }),
        ],
      },
      alias: {
        '@': resolve('src'),
      },
    },
    devServer: {
      proxy: {
        '/mock': {
          target: '',
          changeOrigin: true,
          pathRewrite: {
            '^/mock': '',
          },
        },
        '/api': {
          target: 'http://192.168.31.19:8088',
          changeOrigin: true,
          pathRewrite: {
            '^/api': '',
          },
        },
        '/api_param': {
          target: 'http://spear-param.dev3.fxexpert.cn',
          changeOrigin: true,
          pathRewrite: {
            '^/api_param': '',
          },
        },
      },
    },
  }
}
