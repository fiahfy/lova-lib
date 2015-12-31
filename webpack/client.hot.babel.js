import webpack from 'webpack'
import baseConfig from './client.babel'

const config = {
  entry: [baseConfig.entry].concat([
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server'
  ]),
  plugins: baseConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ]),
  devServer: {
    proxy: [{
      path: /^.*$/,
      target: 'http://localhost:3000',
      secure: false
    }]
  }
}

module.exports = Object.assign({}, baseConfig, config);
