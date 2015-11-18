var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './client/assets/js/AppBootstrap.js',
  output: {
    path: './client/assets/build/',
    filename: '../js/bundle.js',
//    chunkFilename: '../js/[name]-[chunkhash].js',
  },
  plugins: [
//    new webpack.NoErrorsPlugin(),
////    new webpack.optimize.UglifyJsPlugin(),
//    new webpack.optimize.OccurenceOrderPlugin(),
//    new webpack.optimize.DedupePlugin(),
//    //new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
////    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
//    new webpack.DefinePlugin({
//      'process.env': {
//        // This has effect on the react lib size
//        'NODE_ENV': JSON.stringify('production')
//      }
//    })
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url?limit=100000' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
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
