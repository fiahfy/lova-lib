'use strict';

let co = require('co');
let logger = require('../../utils/logger');
let scraper = require('../../utils/scraper');
let models = require('../../models');

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

    // get servant map to convert servant id
    let servantMap = yield getServantMap();

    let d = from;
    while (d <= to) {
      for (let mode of ['win', 'used']) {
        yield updateRanking(d, mode, servantMap, force);
      }
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
    }
  });
};

function updateRanking(date, mode, servantMap, force) {
  return co(function *() {
    logger.verbose('Update Servant Ranking Begin: date = %s (%s)', date.toUTCString(), mode);

    let results = yield findRanking({mode: mode, date: date});
    if (results.length) {
      // check exists if not force update
      if (!force) {
        logger.verbose('Servant Ranking is Almost Exists');
        return;
      }

      // delete
      logger.info('Delete Servant Ranking');
      yield deleteRanking({mode: mode, date: date});
    }

    // get ranking
    let rankings = yield getRanking(date, mode);

    let data = [];
    for (let r of rankings) {
      data.push({
        mode: mode,
        date: date,
        servant_id: servantMap[r.tribe][Number(r.id)],
        seq: r.seq,
        rank: r.rank,
        score: r.score
      });
    }

    if (!data) {
      throw new Error('Servant Ranking Data is Nothing');
    }

    // insert
    logger.info('Insert Servant Ranking');
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

function getRanking(date, mode) {
  return co(function *() {
    let body = (yield scraper.fetchServantRanking(date, mode)).body;
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1]);
  });
}

function getServantMap() {
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
