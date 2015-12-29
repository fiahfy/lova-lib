import webpack from 'webpack'
import baseConfig from './server.babel'

const config = {
  entry: [baseConfig.entry].concat([
    'webpack/hot/poll?1000'
  ]),
  plugins: baseConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ])
}

module.exports = Object.assign({}, baseConfig, config);
