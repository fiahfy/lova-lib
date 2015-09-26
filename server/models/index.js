'use strict';

var fs = require('fs');
var mongoose = require('mongoose');

var config = {
  host: process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
  port: process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
  user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
  pass: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
  db: 'lova'
};

var uri = (function(config) {
  var uri = '';
  if (config.user) {
    uri += config.user;
    if (config.pass) {
      uri += `:${config.pass}`;
    }
    uri += '@';
  }
  uri += config.host;
  if (config.port) {
    uri += `:${config.port}`;
  }
  return uri = `mongodb://${uri}/${config.db}`;
})(config);

mongoose.connect(uri);

mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + uri);
});

mongoose.connection.on('error',function(err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    module.exports[moduleName] = require('./' + moduleName);
  }
});
