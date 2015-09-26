'use strict';

var models = require('../models');
var Q = require('q');

function *servant(id) {
  this.body = yield models.servant.findOne({_id: id}).exec();
}

module.exports = servant;
