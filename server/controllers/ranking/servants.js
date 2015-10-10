'use strict';

let models = require('../../models');

function *servants(id, mode, year, month, date) {
  console.log(id, mode, year, month, date);
  let d = new Date(Date.UTC(year, month - 1, date));
  this.body = yield models.servantwinranking.find({date: d}).sort({seq: 1}).exec();
}

module.exports = servants;
