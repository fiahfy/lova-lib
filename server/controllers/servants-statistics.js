'use strict';

let models = require('../models');

function *servantsStatistics() {
  let d = new Date;
  d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30));

  let body = {};
  for (let mode of ['win', 'used']) {
    body[mode] = yield models.servantranking.find({
      servant_id: this.params.id,
      mode: mode,
      date: { $gte : d }
    }, 'date score').sort({date: 1}).exec();
  }
  this.body = body;
}

module.exports = servantsStatistics;
