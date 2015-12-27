import co from 'co'
import logger from '../../utils/logger'
import * as scraper from '../../utils/scraper'
import * as models from '../../models'

const maps = ['all', 'vermilion', 'braze']
const queues = ['all', 'normal', 'solo']

export default function(date, dateFrom, dateTo, force) {
  return co(function *() {
    let from, to
    if (date) {
      let d = new Date(date)
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
      if (isNaN(d.valueOf())) {
        throw new Error('Invalid Date: ' + date)
      }
      from = to = d
    } else if (dateFrom && dateTo) {
      from = new Date(dateFrom)
      from = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()))
      if (isNaN(from.valueOf())) {
        throw new Error('Invalid Date: ' + dateFrom)
      }
      to = new Date(dateTo)
      to = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()))
      if (isNaN(to.valueOf())) {
        throw new Error('Invalid Date: ' + dateTo)
      }
    } else {
      // today if empty
      let d = new Date
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
      from = to = d
    }

    let d = from
    while (d <= to) {
      for (let map of maps) {
        for (let queue of queues) {
          yield updateRanking(d, map, queue, force)
        }
      }
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))
    }
  })
}

function updateRanking(date, map, queue, force) {
  return co(function *() {
    logger.verbose('Update Spell Ranking Begin: date = %s (%s, %s)', date.toUTCString(), map, queue)

    const results = yield findRanking({date: date, map: map, queue: queue})
    if (results.length) {
      // check exists if not force update
      if (!force) {
        logger.verbose('Spell Ranking is Almost Exists')
        return
      }

      // delete
      logger.info('Delete Spell Ranking')
      yield deleteRanking({date: date, map: map, queue: queue})
    }

    // get ranking
    const rankings = yield getRanking(date, map, queue)
    if (!rankings) {
      logger.warn('Spell Ranking Data is Nothing')
      return
    }

    let data = rankings.map(ranking => {
      return {
        date:     date,
        map:      map,
        queue:    queue,
        spell_id: getSpellIdWithName(ranking.name),
        seq:      ranking.seq,
        rank:     ranking.rank,
        score:    ranking.score
      }
    })

    // insert
    logger.info('Insert Ranking Ranking')
    for (let d of data) {
      yield insertRanking(d)
    }
  })
}

function findRanking(args) {
  return models.spellRanking.find(args).exec()
}

function deleteRanking(args) {
  return models.spellRanking.remove(args).exec()
}

function insertRanking(args) {
  return co(function *() {
    const result = (yield models.counter.getNewId('spellRanking')).result
    const _id = result.value.seq
    yield models.spellRanking.update({_id: _id}, args, {upsert: true}).exec()
  })
}

function getRanking(date, map, queue) {
  return co(function *() {
    const body = (yield scraper.fetchSpellRanking(date, map, queue)).body
    return JSON.parse(body.match(/^\w+\((.*)\);$/i)[1])
  }).then(null, () => {
    return null
  })
}

function getSpellIdWithName(name) {
  return [
    null,
    'キュアオール',
    'リターンゲート',
    'パワーライズ',
    'クイックドライブ',
    'リザレクション',
    'フォースフィールド',
    'クレアボヤンス',
    'クロノフリーズ',
    'リモートサモン'
  ].indexOf(name)
}
