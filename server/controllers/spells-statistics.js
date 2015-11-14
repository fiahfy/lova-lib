'use strict';

let models = require('../models');

function *servantsStatistics() {
  let d = new Date;
  d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30));

  let map = this.query.map || 'all';
  let queue = this.query.queue || 'all';

  let data = yield models.spellranking.find({
    date: { $gte : d },
    map: map,
    queue: queue
  }, 'spell_id date score').sort({date: 1}).exec();

  let hash = data.reduce((prev, current) => {
    if (!prev[current.spell_id]) {
      prev[current.spell_id] = [];
    }
    prev[current.spell_id].push(current);
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
