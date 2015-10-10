'use strict';

var mongoose = require('mongoose');
var commander = require('commander');
var commands = require('./server/commands');
var logger = require('./server/utils/logger');

var promise = null;

commander
  .command('update-servant [url]')
  .alias('ups')
  .description('update servant data')
  .option('-f, --force', 'force update', null, null)
  .action(function(url, opts) {
    promise = commands.update.servant(url, opts.force);
  });

commander
  .command('update-prize')
  .alias('upp')
  .description('update prize data')
  .action(function() {
    promise = commands.update.prize();
  });

commander
  .command('update-ranking <target>')
  .alias('upr')
  .description('update ranking data')
  .option('-d, --date [date]', 'update force', null, null)
  .action(function(target, opts) {
    promise = commands.update.ranking(target, opts.date);
  });

commander
  .command('download-servant')
  .alias('dls')
  .description('download servant images')
  .option('-i, --id [id]', 'target servant id', null, null)
  .option('-f, --force', 'force download', null, null)
  .action(function(opts) {
    promise = commands.download.servant(opts.id, opts.force);
  });

commander
  .command('sprite-servant')
  .alias('sps')
  .description('create servant sprite image')
  .action(function() {
    promise = commands.sprite.servant();
  });

commander
  .version('0.0.1')
  .parse(process.argv);

if (!promise) {
  commander.help();
}

promise.then(function(reason) {
    mongoose.disconnect();
  }, function(reason) {
    mongoose.disconnect();
    logger.error(reason);
  }
);
