'use strict';

let models = require('../../models');

function *servants() {
  let d = new Date(Date.UTC(this.params.year, this.params.month - 1, this.params.date));
  switch (this.params.mode) {
    case 'win':
      this.body = yield models.servantwinranking.find({date: d}).sort({seq: 1}).exec();
      break;
    case 'used':
      this.body = yield models.servantusedranking.find({date: d}).sort({seq: 1}).exec();
      break;
  }
}

module.exports = servants;
