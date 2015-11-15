'use strict';

let models = require('../models');

function *servantsStatistics() {
  let d = (yield models.spellranking.findOne({}).sort({date: -1}).exec()).date || new Date();
  switch (this.query.term) {
    case 'day':
      break;
    case 'month':
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30));
  }

  let map = this.query.map || 'all';
  let queue = this.query.queue || 'all';

  if (!isNaN(this.params.id)) {
    this.body = yield models.spellranking.find({
      spell_id: this.params.id,
      date: { $gte : d },
      map: map,
      queue: queue
    }, '-_id date score').sort({date: 1}).exec();
    return;
  }

  let data = yield models.spellranking.find({
    date: { $gte : d },
    map: map,
    queue: queue
  }, '-_id spell_id date score').sort({date: 1}).exec();

  let hash = data.reduce((prev, current) => {
    let spellId = current.spell_id;
    if (!prev[spellId]) {
      prev[spellId] = [];
    }
    current.spell_id = undefined;
    prev[spellId].push(current);
    return prev;
  }, {});

  this.body = Object.keys(hash).map((spellId) => {
    return {
      spell_id: spellId,
      data: hash[spellId]
    };
  });
}

module.exports = servantsStatistics;
