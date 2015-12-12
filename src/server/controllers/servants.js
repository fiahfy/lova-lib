'use strict';

let models = require('../models');

function *servants() {
  let fields = (this.query.fields || '').replace(',', ' ');
  let id = this.params.id;

  if (id) {
    let servants = yield models.servant.findOne({_id: id}, fields).exec();
    if (typeof this.query.with_statistic == 'undefined') {
      this.body = servants;
      return;
    }
    servants = deepCopy(servants);
    let statistics = yield getStatistics(id);
    servants = mergeStatistics(servants, statistics);
    this.body = servants;
    return;
  }

  let servants = yield models.servant.find({}, fields).sort({_id: 1}).exec();
  if (typeof this.query.with_statistic == 'undefined') {
    this.body = servants;
    return;
  }
  servants = deepCopy(servants);
  let statistics = yield getStatistics();
  servants.forEach((e) => {
    e = mergeStatistics(e, statistics);
  });
  this.body = servants;
}

function *getLastDate() {
  let statistic  = (yield models.servantranking.findOne().sort({date: -1}).exec());
  return statistic ? statistic.date : new Date();
}

function *getStatistics(servantId) {
  let date = yield getLastDate();
  let params = {
    date: date,
    map: 'all',
    queue: 'all'
  };
  if (servantId) {
    params['servant_id'] = servantId;
  }
  let statistics = yield models.servantranking.find(params, '-_id servant_id mode score').exec();
  statistics = statistics.reduce((prev, current) => {
    let servantId = current.servant_id;
    if (!prev[servantId]) {
      prev[servantId] = {};
    }
    prev[servantId][current.mode] = current.score;
    return prev;
  }, {});
  return statistics;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function mergeStatistics(servants, statistics) {
  if (!statistics[servants.id]) {
    statistics[servants.id] = {win: 0, used: 0};
  }
  servants['win_rate'] = statistics[servants.id]['win'] || 0;
  servants['used_rate'] = statistics[servants.id]['used'] || 0;
  return servants;
}

module.exports = servants;
