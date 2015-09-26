'use strict';

var models = require('../models');
var Q = require('q');

function *servants() {
  this.body = yield models.servant.find({}).exec();
}

module.exports = servants;
