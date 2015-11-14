'use strict';

let models = require('../models');

function *servantsStatistics() {
  let d = new Date;
  d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30));

  let mode = this.query.mode || 'used';
  let map = this.query.map || 'all';
  let queue = this.query.queue || 'all';

  this.body = yield models.servantranking.find({
    servant_id: this.params.id,
    date: { $gte : d },
    mode: mode,
    map: map,
    queue: queue
  }, 'date score').sort({date: 1}).exec();
}

module.exports = servantsStatistics;
