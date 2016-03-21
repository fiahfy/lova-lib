import moment from 'moment'
import logger from '../../utils/logger'
import * as scraper from '../../utils/scraper'
import * as models from '../../models'

const tribes = ['bst', 'hly', 'dvl', 'sea', 'und']

export default function(date, dateFrom, dateTo, force) {
  return new Promise(async function(resolve, reject) {
    try {
      let d, from, to
      if (date) {
        d = moment.utc(date)
        if (!d.isValid()) {
          throw new Error('Invalid Date: ' + date)
        }
        from = to = d.startOf('day').toDate()
      } else if (dateFrom && dateTo) {
        d = moment.utc(dateFrom)
        if (!d.isValid()) {
          throw new Error('Invalid Date: ' + dateFrom)
        }
        from = d.startOf('day').toDate()
        d = moment.utc(dateTo)
        if (!d.isValid()) {
          throw new Error('Invalid Date: ' + dateTo)
        }
        to = d.startOf('day').toDate()
      } else {
        // yesterday if empty
        d = moment.utc().subtract(1, 'days')
        from = to = d.startOf('day').toDate()
      }

      // get servant map to convert servant id
      let servantMap = await getServantMap()

      let now = from
      while (now <= to) {
        await updateRanking(now, servantMap, force)
        now = moment.utc(now).add(1, 'days').toDate()
      }
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

async function updateRanking(date, servantMap, force) {
  logger.verbose('Update Combination Ranking Begin: date = %s', date.toUTCString())

  const results = await findRanking({date})
  if (results.length) {
    // check exists if not force update
    if (!force) {
      logger.verbose('Combination Ranking is Almost Exists')
      return
    }

    // delete
    logger.info('Delete Combination Ranking')
    await deleteRanking({date})
  }

  for (let tribe of tribes) {
    // get ranking
    const rankings = await getRanking(date, tribe)
    if (!rankings) {
      logger.warn('Combination Ranking Data is Nothing: tribe = %s', tribe)
      continue
    }

    logger.info('Insert Combination Ranking: tribe = %s', tribe)

    for (let ranking of rankings) {
      const servantIds = _.range(1, 5).map(i => {
        return servantMap[ranking[i].tribe][Number(ranking[i].id)]
      }).sort((a, b) => a > b)

      const combination = await findCombination({servant_ids: servantIds})
      let combinationId = (combination || {})._id
      if (!combinationId) {
        logger.info('Insert Combination: servant_ids = %j', servantIds)
        const result = await insertCombination({servant_ids: servantIds})
        combinationId = result.upserted[0]._id
      }
      // usage
      const usageRateData = {
        date:           date,
        mode:           'usage',
        combination_id: combinationId,
        seq:            ranking.seq,
        rank:           ranking.rank,
        count:          ranking.usage_count
      }
      await insertRanking(usageRateData)
      // win
      const winRateData = {
        date:           date,
        mode:           'win',
        combination_id: combinationId,
        score:          ranking.win_rate
      }
      await insertRanking(winRateData)
    }
  }
}

async function findCombination(args) {
  return await models.combination.findOne(args).exec()
}

async function insertCombination(args) {
  const result = (await models.counter.getNewId('combination')).result
  const _id = result.value.seq
  return await models.combination.update({_id: _id}, args, {upsert: true}).exec()
}

async function findRanking(args) {
  return await models.combinationRanking.find(args).exec()
}

async function deleteRanking(args) {
  await models.combinationRanking.remove(args).exec()
}

async function insertRanking(args) {
  const result = (await models.counter.getNewId('combinationRanking')).result
  const _id = result.value.seq
  await models.combinationRanking.update({_id: _id}, args, {upsert: true}).exec()
}

async function getRanking(date, tribe) {
  try {
    const body = (await scraper.fetchCombinationRanking(date, tribe)).body
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1])
  } catch (e) {
    return null
  }
}

async function getServantMap() {
  const servants = await models.servant.find({}).exec()
  let map = {}
  for (let servant of servants) {
    const tribeName = getTribeName(servant.tribe_id)
    if (!map[tribeName]) {
      map[tribeName] = {}
    }
    map[tribeName][servant.tribe_code] = servant._id
  }
  return servants.reduce((previous, current) => {
    const tribeName = getTribeName(current.tribe_id)
    if (!previous[tribeName]) {
      previous[tribeName] = {}
    }
    previous[tribeName][current.tribe_code] = current._id
    return previous
  }, {})
}

function getTribeName(tribeId) {
  return [null, 'bst', 'hly', 'dvl', 'sea', 'und'][tribeId]
}
