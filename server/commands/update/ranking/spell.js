'use strict';

let co = require('co');
let logger = require('../../../utils/logger');
let scraper = require('../../../utils/scraper');
let models = require('../../../models');

const maps = ['all', 'vermilion', 'braze'];
const queues = ['all', 'normal', 'solo'];

module.exports = function(date, dateFrom, dateTo, force) {
  return co(function *() {
    let from, to;
    if (date) {
      let d = new Date(date);
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      if (isNaN(d.valueOf())) {
        throw new Error('Invalid Date: ' + date);
      }
      from = to = d;
    } else if (dateFrom && dateTo) {
      from = new Date(dateFrom);
      from = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
      if (isNaN(from.valueOf())) {
        throw new Error('Invalid Date: ' + dateFrom);
      }
      to = new Date(dateTo);
      to = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));
      if (isNaN(to.valueOf())) {
        throw new Error('Invalid Date: ' + dateTo);
      }
    } else {
      // today if empty
      let d = new Date;
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      from = to = d;
    }

    let d = from;
    while (d <= to) {
      for (let map of maps) {
        for (let queue of queues) {
          yield updateRanking(d, map, queue, force);
        }
      }
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
    }
  });
};

function updateRanking(date, map, queue, force) {
  return co(function *() {
    logger.verbose('Update Spell Ranking Begin: date = %s (%s, %s)', date.toUTCString(), map, queue);

    let results = yield findRanking({date: date, map: map, queue: queue});
    if (results.length) {
      // check exists if not force update
      if (!force) {
        logger.verbose('Spell Ranking is Almost Exists');
        return;
      }

      // delete
      logger.info('Delete Spell Ranking');
      yield deleteRanking({date: date, map: map, queue: queue});
    }

    // get ranking
    let rankings = yield getRanking(date, map, queue);
    if (!rankings) {
      logger.warn('Spell Ranking Data is Nothing');
      return;
    }

    let data = [];
    for (let r of rankings) {
      data.push({
        date: date,
        map: map,
        queue: queue,
        spell_id: getSpellIdWithName(r.name),
        seq: r.seq,
        rank: r.rank,
        score: r.score
      });
    }

    // insert
    logger.info('Insert Ranking Ranking');
    for (let d of data) {
      yield insertRanking(d);
    }
  });
}

function findRanking(args) {
  return models.spellranking.find(args).exec();
}

function deleteRanking(args) {
  return models.spellranking.remove(args).exec();
}

function insertRanking(args) {
  return co(function *() {
    let result = (yield models.counter.getNewId('spellranking')).result;
    let _id = result.value.seq;
    yield models.spellranking.update({_id: _id}, args, {upsert: true}).exec();
  });
}

function getRanking(date, map, queue) {
  return co(function *() {
    let body = (yield scraper.fetchSpellRanking(date, map, queue)).body;
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1]);
  }).then(null, () => {
    return null;
  });
}

function getSpellIdWithName(name) {
  return [,
    'キュアオール',
    'リターンゲート',
    'パワーライズ',
    'クイックドライブ',
    'リザレクション',
    'フォースフィールド',
    'クレアボヤンス',
    'クロノフリーズ',
    'リモートサモン'
  ].indexOf(name);
}
