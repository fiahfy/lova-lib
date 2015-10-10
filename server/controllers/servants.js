'use strict';

let models = require('../models');

function *servants(id) {
  if (!isNaN(id)) {
    this.body = yield models.servant.findOne({_id: id}).exec();
  } else {
    this.body = yield models.servant.find({}).sort({_id: 1}).exec();
  }
}

module.exports = servants;
