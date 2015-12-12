'use strict';

let models = require('../models');

function *prizes() {
  this.body = yield models.prize.find({}).exec();
}

module.exports = prizes;
