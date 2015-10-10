'use strict';

let models = require('../../models');

function *servants() {
  let d = new Date(Date.UTC(this.params.year, this.params.month - 1, this.params.date));
  this.body = yield models.servantwinranking.find({date: d}).sort({seq: 1}).exec();
}

module.exports = servants;
