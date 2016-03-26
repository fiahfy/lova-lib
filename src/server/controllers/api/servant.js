import moment from 'moment'
import * as models from '../../models'

export default async function (ctx) {
  const id = +ctx.params.id

  const params = id ? {_id: id} : {}
  const fields = (ctx.query.fields || '').replace(',', ' ')

  let servants = await models.servant.find(params, fields).exec()
  if (typeof ctx.query.with_statistic !== 'undefined') {
    servants = await attachStatistcs(servants)
  }

  const body = id ? servants[0] : servants
  if (body) {
    ctx.body = body
  }
}

async function attachStatistcs(servants) {
  const statistic = await models.servantRanking.findOne().sort({date: -1}).exec()
  const date = statistic ? statistic.date : moment.utc().startOf('day').toDate()
  const servantIds = _.map(servants, 'id')

  const params = {
    date,
    servant_id: {$in: servantIds}
  }
  const fields = '-_id servant_id mode score'
  const statistics = await models.servantRanking.find(params, fields).exec()

  const statisticsWithId = statistics.reduce((previous, current) => {
    const servantId = current.servant_id
    if (!previous[servantId]) {
      previous[servantId] = []
    }
    previous[servantId].push(current)
    return previous
  }, {})

  return servants.map(servant => {
    let newObject = servant.toObject()
    newObject['win_rate']   = 0
    newObject['usage_rate'] = 0
    const statistics = statisticsWithId[servant.id] || []
    return statistics.reduce((previous, current) => {
      switch (current.mode) {
      case 'win':
        previous['win_rate'] = current.score
        break
      case 'usage':
        previous['usage_rate'] = current.score
        break
      }
      return previous
    }, newObject)
  })
}
