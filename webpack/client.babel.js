import webpack from 'webpack'

export default {
  target: 'web',
  debug: true,
  devtool: 'cheap-source-map',
  entry: {
    main: './src/client/bootstrap.js',
    style: './src/client/loader.js'
  },
  output: {
    path: './public/assets/',
    publicPath: '/assets/',
    filename: 'js/[name].bundle.js'
  },
  plugins: [
    //new webpack.DefinePlugin({
    //  'process.env': {
    //    'NODE_ENV': JSON.stringify('production')
    //  }
    //}),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.AggressiveMergingPlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //  compress: {
    //    warnings: false
    //  }
    // }),
    new webpack.NoErrorsPlugin(),
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
        loader: 'style!css'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url',
        query: {
          limit: '10000',
          name: 'lib/[hash].[ext]'
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
      },
      {
        test: /fetch\.js$/,
        loader: 'imports?this=>global!exports?global.fetch'
      }
    ]
  }
}
