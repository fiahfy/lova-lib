'use strict';

var models = require('../models');

function *servants() {
  this.body = yield models.servant.find({}).exec();
}

module.exports = servants;
