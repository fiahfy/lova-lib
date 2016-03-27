import moment from 'moment'
import logger from '../../utils/logger'
import * as scraper from '../../utils/scraper'
import * as models from '../../models'
import * as SpellUtils from '../../../client/utils/spell-utils'

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

      let now = from
      while (now <= to) {
        for (let map of maps) {
          for (let queue of queues) {
            await updateRanking(d, map, queue, force)
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

async function updateRanking(date, map, queue, force) {
  logger.verbose('Update Spell Ranking Begin: date = %s (%s, %s)',
    moment.utc(date).format('YYYY-MM-DD'), map, queue)

  const results = await findRankings({date, map, queue})
  if (results.length) {
    // check exists if not force update
    if (!force) {
      logger.verbose('Spell Ranking is Almost Exists')
      return
    }

    // delete
    logger.info('Delete Spell Ranking')
    await deleteRankings({date, map, queue})
  }

  // get ranking
  const rankings = await fetchRankings(date, map, queue)
  if (!rankings) {
    logger.warn('Spell Ranking Data is Nothing')
    return
  }

  logger.info('Insert Ranking Ranking')

  for (let ranking of rankings) {
    const data = {
      date:     date,
      map:      map,
      queue:    queue,
      spell_id: SpellUtils.getSpellIdWithName(ranking.name),
      seq:      ranking.seq,
      rank:     ranking.rank,
      score:    ranking.score / 100
    }
    await insertRanking(data)
  }
}

async function findRankings(args) {
  return await models.spellRanking.find(args).exec()
}

async function deleteRankings(args) {
  await models.spellRanking.remove(args).exec()
}

async function insertRanking(args) {
  const result = (await models.counter.getNewId('spellRanking')).result
  const _id = result.value.seq
  return await models.spellRanking.update({_id: _id}, args, {upsert: true}).exec()
}

async function fetchRankings(date, map, queue) {
  try {
    const body = (await scraper.fetchSpellRanking(date, map, queue)).body
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1])
  } catch (e) {
    return null
  }
}
