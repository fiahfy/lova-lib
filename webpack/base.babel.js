import webpack from 'webpack'
import config from '../src/config'

export default {
  debug: config.env === 'development',
  devtool: config.env === 'development' ? 'cheap-source-map' : 'source-map',
  plugins:[
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(config.env)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.md$/,
        loader: 'html!markdown'
      },
      {
        test: /\.(css|scss)$/,
        loader: 'css!sass'
      },
      {
        test: /\.(jpg|gif|png|svg)$/,
        loader: 'url',
        query: {
          limit: '10000',
          name: 'lib/[hash].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url',
        query: {
          limit: '10000',
          name: 'font/[hash].[ext]'
        }
      },
      {
        test: /\.node$/,
        loader: "node-loader"
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['transform-decorators-legacy'],
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /flat-ui\.js$/,
        loader: 'imports?this=>window'
      }
    ]
  }
}
