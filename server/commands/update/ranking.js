'use strict';

let co = require('co');
let scraper = require('../../utils/scrapers');
let models = require('../../models');
let logger = require('../../utils/logger');

module.exports = function(target, date) {
  return co(function *() {
    let d;
    if (date) {
      d = new Date(date);
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      if (isNaN(d.valueOf())) {
        logger.error('Invalid Date: %s', date);
        return;
      }
    } else {
      // yesterday if empty
      d = new Date;
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setDate(d.getDate() - 1);
    }

    switch (target) {
      case 'win':
        yield updateWinRanking(d);
        break;
      case 'used':
        yield updateUsedRanking(d);
        break;
    }
  });
};

function updateWinRanking(date) {
  return co(function *() {
    // get ranking
    let rankings = yield getWinRankingWithDate(date);
    // get servant map to convert servant id
    let map = yield getServantMap();

    let data = [];
    for (let r of rankings) {
      data.push({
        date: date,
        servant_id: map[r.tribe][Number(r.id)],
        seq: r.seq,
        rank: r.rank,
        rate: r.score
      });
    }

    if (!data) {
      logger.error('Servant Win Ranking Data is Nothing');
      return;
    }

    // delete
    logger.info('Delete Servant Win Ranking: date = %s', date+'');
    yield deleteWinRanking({date: date});

    // insert
    logger.info('Insert Servant Win Ranking');
    for (let d of data) {
      yield insertWinRanking(d);
    }
  });
}

function updateUsedRanking(date) {
  return co(function *() {
    // get ranking
    let rankings = yield getUsedRankingWithDate(date);
    // get servant map to convert servant id
    let map = yield getServantMap();

    let data = [];
    for (let r of rankings) {
      data.push({
        date: date,
        servant_id: map[r.tribe][Number(r.id)],
        seq: r.seq,
        rank: r.rank,
        rate: r.score
      });
    }

    if (!data) {
      logger.error('Servant Used Ranking Data is Nothing');
      return;
    }

    // delete
    logger.info('Delete Servant Used Ranking: date = %s', date+'');
    yield deleteUsedRanking({date: date});

    // insert
    logger.info('Insert Servant Used Ranking');
    for (let d of data) {
      yield insertUsedRanking(d);
    }
  });
}

function deleteWinRanking(args) {
  return models.servantwinranking.remove(args).exec();
}

function insertWinRanking(args) {
  return co(function *() {
    let result = (yield models.counter.getNewId('servantwinranking')).result;
    let _id = result.value.seq;
    yield models.servantwinranking.update({_id: _id}, args, {upsert: true}).exec();
  });
}

function deleteUsedRanking(args) {
  return models.servantusedranking.remove(args).exec();
}

function insertUsedRanking(args) {
  return co(function *() {
    let result = (yield models.counter.getNewId('servantusedranking')).result;
    let _id = result.value.seq;
    yield models.servantusedranking.update({_id: _id}, args, {upsert: true}).exec();
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
