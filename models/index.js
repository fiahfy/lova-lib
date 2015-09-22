'use strict';

var fs = require('fs');
var mongoose = require('mongoose');

var config = {
  host: process.env.OPENSHIFT_MONGODB_DB_HOST,
  port: process.env.OPENSHIFT_MONGODB_DB_PORT,
  user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
  pass: process.env.OPENSHIFT_MONGODB_DB_PASSWORD
};
var uri = `mongodb://${config.user}:${config.pass}@${config.host}:${config.port}/lovaapi`;

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
