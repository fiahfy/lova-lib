import webpack from 'webpack'

export default {
  target: 'web',
  debug: true,
  devtool: 'cheap-source-map',
  entry: './src/client.js',
  output: {
    path: './public/assets/',
    publicPath: '/assets/',
    filename: 'js/bundle.js'
  },
  plugins: [
    // new webpack.DefinePlugin({
    //  'process.env': {
    //    'NODE_ENV': JSON.stringify('production')
    //  }
    // }),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.AggressiveMergingPlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //  compress: {
    //    warnings: false
    //  }
    // }),
    // new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.md$/,
        loader: 'html!markdown'
      },
      {
        test: /\.css$/,
        loader: 'css'
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
