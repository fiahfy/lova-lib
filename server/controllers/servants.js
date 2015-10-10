'use strict';

let models = require('../models');

function *servants() {
  if (this.params.id) {
    this.body = yield models.servant.findOne({_id: this.params.id}).exec();
  } else {
    this.body = yield models.servant.find({}).sort({_id: 1}).exec();
  }
}

module.exports = servants;
