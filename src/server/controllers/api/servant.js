import * as models from '../../models'

export default async function (ctx) {
  const fields = (ctx.query.fields || '').replace(',', ' ')
  const id = +ctx.params.id

  if (id) {
    let servants = await models.servant.findOne({_id: id}, fields).exec()
    if (typeof ctx.query.with_statistic === 'undefined') {
      ctx.body = servants
      return
    }
    servants = deepCopy(servants)
    const statistics = await getStatistics(id)
    servants = mergeStatistics(servants, statistics)
    ctx.body = servants
    return
  }

  let servants = await models.servant.find({}, fields).sort({_id: 1}).exec()
  if (typeof ctx.query.with_statistic === 'undefined') {
    ctx.body = servants
    return
  }
  servants = deepCopy(servants)
  const statistics = await getStatistics()
  servants.forEach(servant => {
    servant = mergeStatistics(servant, statistics)
  })
  ctx.body = servants
}

async function getLastDate() {
  const statistic = await models.servantRanking.findOne().sort({date: -1}).exec()
  return statistic ? statistic.date : new Date()
}

async function getStatistics(servantId) {
  const date = await getLastDate()
  let params = {
    date: date,
    map: 'all',
    queue: 'all'
  }
  if (servantId) {
    params['servant_id'] = servantId
  }
  let statistics = await models.servantRanking.find(params, '-_id servant_id mode score').exec()
  statistics = statistics.reduce((previous, current) => {
    const servantId = current.servant_id
    if (!previous[servantId]) {
      previous[servantId] = {}
    }
    previous[servantId][current.mode] = current.score
    return previous
  }, {})
  return statistics
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function mergeStatistics(servants, statistics) {
  if (!statistics[servants.id]) {
    statistics[servants.id] = {win: 0, used: 0}
  }
  servants['win_rate'] = statistics[servants.id]['win'] || 0
  servants['used_rate'] = statistics[servants.id]['used'] || 0
  return servants
}
