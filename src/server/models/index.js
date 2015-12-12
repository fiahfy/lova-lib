'use strict';

let fs = require('fs');
let mongoose = require('mongoose');
let config = require('../config/mongodb');
let logger = require('../utils/logger');

mongoose.connect(config.uri);

mongoose.connection.on('connected', function() {
  logger.info('Mongoose default connection open to ' + config.uri);
});

mongoose.connection.on('error',function(err) {
  logger.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  logger.info('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    let fileName = file.split('.')[0];
    let moduleName = fileName.replace(/-(\w)/, function(match, p1, offset, string) {
      return p1.toUpperCase();
    });
    module.exports[moduleName] = require('./' + fileName);
  }
});
