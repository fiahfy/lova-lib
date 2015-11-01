'use strict';

let models = require('../models');

function *servants() {
  let fields = (this.query.fields || '').replace(',', ' ');
  if (this.params.id) {
    this.body = yield models.servant.findOne({_id: this.params.id}, fields).exec();
  } else {
    this.body = yield models.servant.find({}, fields).sort({_id: 1}).exec();
  }
}

module.exports = servants;
