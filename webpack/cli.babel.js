import webpack from 'webpack'
import fs from 'fs'
import clientConfig from './client.babel'

const production = !!process.env.OPENSHIFT_APP_DNS
const plugins = production ? [
  new webpack.DefinePlugin({
   'process.env': {
     'NODE_ENV': JSON.stringify('production')
   }
  })
] : []

const nodeModules = fs.readdirSync('node_modules')
  .filter(dir => '.bin' !== dir)

const config = {
  target: 'node',
  entry: './src/cli.js',
  output: {
    path: './public/assets/',
    publicPath: '/assets/',
    filename: '../../cli.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeModules,
  plugins: plugins.concat([
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ])
}

export default Object.assign({}, clientConfig, config)
