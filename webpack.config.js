module.exports = {
  entry: './client/assets/js/AppBootstrap.js',
  output: {
    path: './client/assets/build/',
    filename: '../js/bundle.js'
  },
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
