'use strict';

let _ = require('lodash');
let models = require('../models');

function *spellStatistics() {
  let d = (yield models.spellranking.findOne({}).sort({date: -1}).exec()).date || new Date();
  switch (this.query.term) {
    case 'day':
      break;
    case 'month':
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30));
  }

  let params = _.pick(this.query, (value, key) => {
    return ['servant_id', 'map', 'queue'].indexOf(key) > -1;
  });
  params.date = {$gte: d};

  this.body = yield models.spellranking.find(params, '-_id spell_id date map queue score').sort({date: 1}).exec();
}

module.exports = spellStatistics;
