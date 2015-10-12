'use strict';

let models = require('../../models');

function *servants() {
  let d;
  if (this.params.year && this.params.month && this.params.date) {
    d = new Date(Date.UTC(this.params.year, this.params.month - 1, this.params.date));
  } else {
    d = (yield models.servantranking.findOne({mode: this.params.mode}).sort({date: -1}).exec()).date;
  }
  this.body = yield models.servantranking.find({mode: this.params.mode, date: d}).sort({seq: 1}).exec();
}

module.exports = servants;
