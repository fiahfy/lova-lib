var webpack = require('webpack');

module.exports = {
  debug: true,
  devtool: 'source-map',
  entry: {
    main: './client/assets/js/bootstrap.js',
    style: './client/assets/js/loader.js'
  },
  output: {
    path: './client/assets/',
    publicPath: '/assets/',
    filename: 'js/[name].bundle.js',
    chunkFilename: "js/[id].bundle.js"
  },
  plugins: [
    //new webpack.NoErrorsPlugin(),
    //new webpack.DefinePlugin({
    //  'process.env': {
    //    'NODE_ENV': JSON.stringify('production')
    //  }
    //}),
    //  new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    //  new webpack.optimize.MinChunkSizePlugin({minChunkSize: 100000}),
    //new webpack.optimize.DedupePlugin(),
    //new webpack.optimize.OccurenceOrderPlugin(),
    //new webpack.optimize.UglifyJsPlugin({
    //  compress: {
    //    warnings: false
    //  }
    //}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      _: 'lodash',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  module: {
    loaders: [
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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
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
  },
  //externals: {
  //  // require("jquery") is external and available
  //  //  on the global var jQuery
  //  jquery: "jQuery"
  //}
  // devServer: {
  //   proxy: {
  //     '/assets': {
  //       target: 'http://localhost:3000',
  //       secure: false,
  //       // bypass: function(req, res, proxyOptions) {
  //       //   if (req.headers.accept.indexOf('html') !== -1) {
  //       //       console.log('Skipping proxy for browser request.');
  //       //       return '/index.html';
  //       //   }
  //       // },
  //     },
  //   },
  // }
};
