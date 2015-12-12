'use strict';

let winston = require('winston');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({level: 'silly', timestamp: true})
  ]
});
logger.cli();

module.exports = logger;
