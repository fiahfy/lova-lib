'use strict';

let models = require('../models');

function *servants() {
  this.body = yield models.servant.find({}).sort({_id: 1}).exec();
}

module.exports = servants;
