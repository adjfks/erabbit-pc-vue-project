const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/styles/variables.less'), path.resolve(__dirname, './src/assets/styles/mixins.less')]
    }
  },
  devServer: {
    open: true,
    host: '127.0.0.1',
    historyApiFallback: true,
    allowedHosts: 'all'
  },
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
})
