const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
const path = require('path')
const CracoAntDesignPlugin = require('craco-antd')
const resolve = (dir) => path.resolve(__dirname, dir)
const webpack = require("webpack")
// const AntdDayjsWebpackPlugin =  require('antd-dayjs-webpack-plugin');

module.exports = ({ env }) => {
  const envJs = require('./env.js')[process.env.mode]
  return {
    plugins: [
      {
        plugin: CracoAntDesignPlugin,
        options: {
          customizeTheme: {
            // '@primary-color': '#4945FF',
          },
        },
      },
    ],
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
          new webpack.DefinePlugin({
            API_URL: JSON.stringify(envJs.API_URL),
            MODE: JSON.stringify(envJs.MODE),
          }),
          // new AntdDayjsWebpackPlugin()
        ],
      },
      alias: {
        '@': resolve('src'),
      },
    },
    devServer: {
      proxy: {
        '/api': {
          target: envJs.API_URL,
          changeOrigin: true,
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    },
  }
}
