'use strict';

let models = require('../models');

function *servantsStatistics() {
  let d = (yield models.servantranking.findOne({}).sort({date: -1}).exec()).date || new Date();
  switch (this.query.term) {
    case 'day':
      break;
    case 'month':
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30));
  }

  let mode = this.query.mode || 'used';
  let map = this.query.map || 'all';
  let queue = this.query.queue || 'all';

  if (!isNaN(this.params.id)) {
    this.body = yield models.servantranking.find({
      servant_id: this.params.id,
      date: { $gte : d },
      mode: mode,
      map: map,
      queue: queue
    }, '-_id date score').sort({date: 1}).exec();
    return;
  }

  let data = yield models.servantranking.find({
    date: { $gte : d },
    mode: mode,
    map: map,
    queue: queue
  }, '-_id servant_id date score').sort({date: 1}).exec();

  let hash = data.reduce((prev, current) => {
    let servantId = current.servant_id;
    if (!prev[servantId]) {
      prev[servantId] = [];
    }
    current.servant_id = undefined;
    prev[servantId].push(current);
    return prev;
  }, {});

  this.body = Object.keys(hash).map((servantId) => {
    return {
      servant_id: servantId,
      data: hash[servantId]
    };
  });
}

module.exports = servantsStatistics;
