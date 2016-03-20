import * as models from '../../models'

export default function *() {
  const fields = (this.query.fields || '').replace(',', ' ')
  const id = this.params.id

  if (id) {
    let servants = yield models.servant.findOne({_id: id}, fields).exec()
    if (typeof this.query.with_statistic === 'undefined') {
      this.body = servants
      return
    }
    servants = deepCopy(servants)
    const statistics = yield getStatistics(id)
    servants = mergeStatistics(servants, statistics)
    this.body = servants
    return
  }

  let servants = yield models.servant.find({}, fields).sort({_id: 1}).exec()
  if (typeof this.query.with_statistic === 'undefined') {
    this.body = servants
    return
  }
  servants = deepCopy(servants)
  const statistics = yield getStatistics()
  servants.forEach(servant => {
    servant = mergeStatistics(servant, statistics)
  })
  this.body = servants
}

function *getLastDate() {
  const statistic = yield models.servantRanking.findOne().sort({date: -1}).exec()
  return statistic ? statistic.date : new Date()
}

function *getStatistics(servantId) {
  const date = yield getLastDate()
  let params = {
    date: date,
    map: 'all',
    queue: 'all'
  }
  if (servantId) {
    params['servant_id'] = servantId
  }
  let statistics = yield models.servantRanking.find(params, '-_id servant_id mode score').exec()
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
    statistics[servants.id] = {win: 0, usage: 0}
  }
  servants['win_rate'] = statistics[servants.id]['win'] || 0
  servants['usage_rate'] = statistics[servants.id]['usage'] || 0
  return servants
}
