'use strict';

var mongoose = require('mongoose');
var commander = require('commander');
var commands = require('./server/commands');
var logger = require('./server/utils/logger');

var promise;

commander
  .command('update <target>')
  .alias('up')
  .description('update data')
  .option('-u, --url [url]', 'target servant url', null, null)
  .option('-f, --force', 'update force', null, null)
  .action(function(target, opts) {
    switch (target) {
      case 'servant':
        promise = commands.update.servant(opts.url, opts.force);
        break;
      case 'prize':
        promise = commands.update.prize();
        break;
    }
  });
commander
  .command('image <command>')
  .alias('im')
  .description('manage images')
  .option('-i, --id [id]', 'target servant id', null, null)
  .option('-f, --force', 'download force', null, null)
  .action(function(command, opts) {
    switch (command) {
      case 'download':
        promise = commands.image.download(opts.id, opts.force);
        break;
      case 'sprite':
        promise = commands.image.sprite();
        break;
    }
  });
commander
  .version('0.0.1')
  .parse(process.argv);

if (typeof promise === 'undefined') {
  commander.help();
}

promise.then(function(reason) {
    mongoose.disconnect();
  }, function(reason) {
    mongoose.disconnect();
    logger.error(reason);
  }
);
