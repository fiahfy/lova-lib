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

    // get servant map to convert servant id
    let servantMap = yield getServantMap();

    let d = from;
    while (d <= to) {
      for (let mode of ['win', 'used']) {
        for (let map of maps) {
          for (let queue of queues) {
            yield updateRanking(d, mode, map, queue, servantMap, force);
          }
        }
      }
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
    }
  });
};

function updateRanking(date, mode, map, queue, servantMap, force) {
  return co(function *() {
    logger.verbose('Update Servant Ranking Begin: date = %s (%s, %s, %s)', date.toUTCString(), mode, map, queue);

    let results = yield findRanking({date: date, mode: mode, map: map, queue: queue});
    if (results.length) {
      // check exists if not force update
      if (!force) {
        logger.verbose('Servant Ranking is Almost Exists');
        return;
      }

      // delete
      logger.info('Delete Servant Ranking');
      yield deleteRanking({date: date, mode: mode, map: map, queue: queue});
    }

    // get ranking
    let rankings = yield getRanking(date, mode, map, queue);
    if (!rankings) {
      logger.warn('Servant Ranking Data is Nothing');
      return;
    }

    let data = [];
    for (let r of rankings) {
      data.push({
        date: date,
        mode: mode,
        map: map,
        queue: queue,
        servant_id: servantMap[r.tribe][Number(r.id)],
        seq: r.seq,
        rank: r.rank,
        score: r.score
      });
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

function getRanking(date, mode, map, queue) {
  return co(function *() {
    let body = (yield scraper.fetchServantRanking(date, mode, map, queue)).body;
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1]);
  }).then(null, () => {
    return null;
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
