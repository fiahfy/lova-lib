import webpack from 'webpack'
import appConfig from '../src/config'
import baseConfig from './base.babel'

const plugins = appConfig.production ? [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
   compress: {
     warnings: false
   }
  }),
  new webpack.NoErrorsPlugin()
] : []

const config = {
  target: 'web',
  entry: './src/client.js',
  output: {
    path: './public/assets/',
    publicPath: '/assets/',
    filename: 'js/bundle.js'
  },
  plugins: plugins.concat(baseConfig.plugins)
}

export default Object.assign({}, baseConfig, config)
