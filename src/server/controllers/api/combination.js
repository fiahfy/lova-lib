import * as models from '../../models'

export default async function (ctx) {
  const fields = (ctx.query.fields || '').replace(',', ' ')
  const id = +ctx.params.id

  if (id) {
    let combination = await models.combination.findOne({_id: id}, fields).exec()
    if (typeof ctx.query.with_statistic === 'undefined') {
      ctx.body = combination
      return
    }
    combination = deepCopy(combination)
    const statistics = await getStatistics(id)
    combination = mergeStatistics(combination, statistics)
    ctx.body = combination
    return
  }

  let combinations = await models.combination.find({}, fields).sort({_id: 1}).exec()
  if (typeof ctx.query.with_statistic === 'undefined') {
    ctx.body = combinations
    return
  }
  combinations = deepCopy(combinations)
  const statistics = await getStatistics()
  combinations.forEach(combination => {
    combination = mergeStatistics(combination, statistics)
  })
  ctx.body = combinations
}

async function getLastDate() {
  const statistic = await models.combinationRanking.findOne().sort({date: -1}).exec()
  return statistic ? statistic.date : new Date()
}

async function getStatistics(combinationId) {
  const date = await getLastDate()
  let params = {
    date: date
  }
  if (combinationId) {
    params['combination_id'] = combinationId
  }
  let statistics = await models.combinationRanking.find(params, '-_id combination_id mode score count').exec()
  statistics = statistics.reduce((previous, current) => {
    const combinationId = current.combination_id
    if (!previous[combinationId]) {
      previous[combinationId] = {}
    }
    previous[combinationId][current.mode] = current
    return previous
  }, {})
  return statistics
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function mergeStatistics(combination, statistics) {
  if (!statistics[combination.id]) {
    statistics[combination.id] = {win: {score: 0, count: 0}, usage: {score: 0, count: 0}}
  }
  combination['win_rate']    = statistics[combination.id]['win']['score'] || 0
  combination['usage_count'] = statistics[combination.id]['usage']['count'] || 0
  return combination
}
