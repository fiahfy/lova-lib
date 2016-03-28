import moment from 'moment'
import * as models from '../../models'

export default async function (ctx) {
  const id = +ctx.params.id

  const params = id ? {_id: id} : {}
  const fields = (ctx.query.fields || '').replace(',', ' ')

  let combinations = await models.combination.find(params, fields).exec()
  if (typeof ctx.query.with_statistic !== 'undefined') {
    combinations = await attachStatistcs(combinations)
  }

  const body = id ? combinations[0] : combinations
  if (body) {
    ctx.body = body
  }
}

async function attachStatistcs(combinations) {
  const statistic = await models.combinationRanking.findOne().sort({date: -1}).exec()
  const date = statistic ? statistic.date : moment.utc().startOf('day').toDate()
  const combinationIds = _.map(combinations, 'id')

  const params = {
    date,
    combination_id: {$in: combinationIds}
  }
  const fields = '-_id combination_id mode score count'
  const statistics = await models.combinationRanking.find(params, fields).exec()

  const statisticsWithId = statistics.reduce((previous, current) => {
    const combinationId = current.combination_id
    if (!previous[combinationId]) {
      previous[combinationId] = []
    }
    previous[combinationId].push(current)
    return previous
  }, {})

  return combinations.map(combination => {
    let newObject = combination.toObject()
    newObject['win_rate']   = 0
    newObject['usage_count'] = 0
    const statistics = statisticsWithId[combination.id] || []
    return statistics.reduce((previous, current) => {
      switch (current.mode) {
      case 'win':
        previous['win_rate'] = current.score
        break
      case 'usage':
        previous['usage_count'] = current.count
        break
      }
      return previous
    }, newObject)
  })
}
