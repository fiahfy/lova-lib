'use strict';

let co = require('co');
let scraper = require('../../utils/scrapers');
let models = require('../../models');
let logger = require('../../utils/logger');

module.exports = function(target, date, force) {
  return co(function *() {
    let d;
    if (date) {
      d = new Date(date);
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      if (isNaN(d.valueOf())) {
        logger.error('Invalid Date: %s', date);
        return;
      }
    } else {
      // today if empty
      d = new Date;
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }

    switch (target) {
      case 'win':
        yield updateWinRanking(d, force);
        break;
      case 'used':
        yield updateUsedRanking(d, force);
        break;
    }
  });
};

function updateWinRanking(date, force) {
  return co(function *() {
    // check exists if not force update
    if (!force) {
      let results = yield findRanking({mode: 'win', date: date});
      if (results.length) {
        logger.warn('Servant Win Ranking is Almost Exists: date = %s', date.toUTCString());
        return;
      }
    }

    // get ranking
    let rankings = yield getWinRankingWithDate(date);
    // get servant map to convert servant id
    let map = yield getServantMap();

    let data = [];
    for (let r of rankings) {
      data.push({
        mode: 'win',
        date: date,
        servant_id: map[r.tribe][Number(r.id)],
        seq: r.seq,
        rank: r.rank,
        score: r.score
      });
    }

    if (!data) {
      logger.error('Servant Win Ranking Data is Nothing');
      return;
    }

    // delete
    logger.info('Delete Servant Win Ranking: date = %s', date.toUTCString());
    yield deleteRanking({mode: 'win', date: date});

    // insert
    logger.info('Insert Servant Win Ranking');
    for (let d of data) {
      yield insertRanking(d);
    }
  });
}

function updateUsedRanking(date, force) {
  return co(function *() {
    // check exists if not force update
    if (!force) {
      let results = yield findRanking({mode: 'used', date: date});
      if (results.length) {
        logger.warn('Servant Used Ranking is Almost Exists: date = %s', date.toUTCString());
        return;
      }
    }

    // get ranking
    let rankings = yield getUsedRankingWithDate(date);
    // get servant map to convert servant id
    let map = yield getServantMap();

    let data = [];
    for (let r of rankings) {
      data.push({
        mode: 'used',
        date: date,
        servant_id: map[r.tribe][Number(r.id)],
        seq: r.seq,
        rank: r.rank,
        score: r.score
      });
    }

    if (!data) {
      logger.error('Servant Used Ranking Data is Nothing');
      return;
    }

    // delete
    logger.info('Delete Servant Used Ranking: date = %s', date.toUTCString());
    yield deleteRanking({mode: 'used', date: date});

    // insert
    logger.info('Insert Servant Used Ranking');
    for (let d of data) {
      yield insertRanking(d);
    }
  });
}

function findRanking(args) {
  return models.servantranking.find(args).exec();
}

function deleteRanking(args) {
  return models.servantranking.remove(args).exec();
}

function insertRanking(args) {
  return co(function *() {
    let result = (yield models.counter.getNewId('servantranking')).result;
    let _id = result.value.seq;
    yield models.servantranking.update({_id: _id}, args, {upsert: true}).exec();
  });
}

function getWinRankingWithDate(date) {
  return co(function *() {
    let body = (yield scraper.fetchServantWinRanking(date)).body;
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1]);
  });
}

function getUsedRankingWithDate(date) {
  return co(function *() {
    let body = (yield scraper.fetchServantUsedRanking(date)).body;
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1]);
  });
}

function getServantMap(args) {
  return co(function *() {
    let servants = yield models.servant.find({}).exec();
    let map = {};
    for (let servant of servants) {
      let tribeName = getTribeName(servant.tribe_id);
      if (!map[tribeName]) {
        map[tribeName] = {};
      }
      map[tribeName][servant.tribe_code] = servant._id;
    }
    return map;
  });
}

function getTribeName(tribeId) {
  return [, 'bst', 'hly', 'dvl', 'sea', 'und'][tribeId];
}
