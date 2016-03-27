import moment from 'moment'
import logger from '../../utils/logger'
import * as scraper from '../../utils/scraper'
import * as models from '../../models'
import * as ServantUtils from '../../../client/utils/servant-utils'

const modes  = ['win', 'usage']
const maps   = ['all', 'vermilion', 'braze']
const queues = ['all', 'normal', 'solo']

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
        for (let mode of modes) {
          for (let map of maps) {
            for (let queue of queues) {
              await updateRanking(now, mode, map, queue, servantMap, force)
            }
          }
        }
        now = moment.utc(now).add(1, 'days').toDate()
      }
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

async function updateRanking(date, mode, map, queue, servantMap, force) {
  logger.verbose('Update Servant Ranking Begin: date = %s (%s, %s, %s)',
    moment.utc(date).format('YYYY-MM-DD'), mode, map, queue)

  const results = await findRankings({date, mode, map, queue})
  if (results.length) {
    // check exists if not force update
    if (!force) {
      logger.verbose('Servant Ranking is Almost Exists')
      return
    }

    // delete
    logger.info('Delete Servant Ranking')
    await deleteRankings({date, mode, map, queue})
  }

  // get ranking
  const rankings = await fetchRankings(date, mode, map, queue)
  if (!rankings) {
    logger.warn('Servant Ranking Data is Nothing')
    return
  }

  logger.info('Insert Servant Ranking')

  for (let ranking of rankings) {
    const data = {
      date:       date,
      mode:       mode,
      map:        map,
      queue:      queue,
      servant_id: servantMap[ranking.tribe][Number(ranking.id)],
      seq:        ranking.seq,
      rank:       ranking.rank,
      score:      ranking.score / 100
    }
    await insertRanking(data)
  }
}

async function findRankings(args) {
  return await models.servantRanking.find(args).exec()
}

async function deleteRankings(args) {
  await models.servantRanking.remove(args).exec()
}

async function insertRanking(args) {
  const result = (await models.counter.getNewId('servantRanking')).result
  const _id = result.value.seq
  return await models.servantRanking.update({_id: _id}, args, {upsert: true}).exec()
}

async function fetchRankings(date, mode, map, queue) {
  try {
    const body = (await scraper.fetchServantRanking(date, mode, map, queue)).body
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1])
  } catch (e) {
    return null
  }
}

async function getServantMap() {
  const servants = await models.servant.find({}).exec()
  return servants.reduce((previous, current) => {
    const tribeName = ServantUtils.getTribeString(current.tribe_id)
    if (!previous[tribeName]) {
      previous[tribeName] = {}
    }
    previous[tribeName][current.tribe_code] = current._id
    return previous
  }, {})
}
