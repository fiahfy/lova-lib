'use strict';

var models = require('../models');

function *servant(id) {
  this.body = yield models.servant.findOne({_id: id}).exec();
}

module.exports = servant;
