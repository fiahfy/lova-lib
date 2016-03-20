import moment from 'moment'
import * as models from '../../models'

const displayCount = 30

export default async function (ctx) {
  const gap = getGap(ctx.query.period)
  const beginDate = await findBeginDate(gap)

  const params = {
    ...ctx.query,
    date: {$gte: beginDate}
  }
  const rankings = await findRankings(params)

  ctx.body = getStatistics(rankings, gap)
}

function getGap(period) {
  switch (period) {
  case 'weekly':
    return 7
  case 'daily':
  default:
    return 1
  }
}

async function findBeginDate(gap) {
  const ranking = await models.servantRanking.findOne().sort({date: -1}).exec()
  const endDate = ranking ? ranking.date : moment.utc().startOf('day').toDate()
  const beginDate = moment(endDate).utc().startOf('day')
    .subtract(displayCount * gap, 'days').toDate()
  return beginDate
}

async function findRankings(args) {
  const params = _.pickBy(args, (value, key) => {
    return ['servant_id', 'mode', 'map', 'queue', 'date'].indexOf(key) > -1
  })
  return await models.servantRanking
    .find(params, '-_id servant_id mode date map queue score')
    .exec()
}

function getStatistics(rankings, gap) {
  const endDate = _.max(rankings, d => d.date).date

  const scoreMap = rankings.reduce((previous, current) => {
    previous.set(getScoreKey(current), current.score)
    return previous
  }, new Map)

  let results = []
  for (let i = 0; i < displayCount * gap; i += gap) {
    for (let servantId of _.uniq(_.map(rankings, 'servant_id'))) {
      for (let mode of _.uniq(_.map(rankings, 'mode'))) {
        for (let map of _.uniq(_.map(rankings, 'map'))) {
          for (let queue of _.uniq(_.map(rankings, 'queue'))) {
            const scores = _.range(i, i + gap).map(i => {
              const item = {
                date: moment(endDate).subtract(i, 'days').toDate(),
                servant_id: servantId,
                mode,
                map,
                queue
              }
              return scoreMap.get(getScoreKey(item)) || null
            }).filter(score => score !== null)

            if (scores.length === 0) {
              break
            }

            const score = scores.reduce((previous, current) => previous + current)
              / scores.length

            results.unshift({
              date: moment(endDate).subtract(i, 'days').toDate(),
              servant_id: servantId,
              mode,
              map,
              queue,
              score
            })
          }
        }
      }
    }
  }
  return results
}

function getScoreKey(obj) {
  return moment(obj.date).unix() + obj.servant_id + obj.mode + obj.map + obj.queue
}
