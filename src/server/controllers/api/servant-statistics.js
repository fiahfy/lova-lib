import * as models from '../../models'

export default (function *() {
  const ranking = yield models.servantRanking.findOne({}).sort({date: -1}).exec()
  let d = ranking.date || new Date()
  switch (this.query.term) {
    case 'day':
      break
    case 'month':
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30))
  }

  let params = _.pick(this.query, (value, key) => {
    return ['servant_id', 'mode', 'map', 'queue'].indexOf(key) > -1
  })
  params.date = {$gte: d}

  this.body = yield models.servantRanking.find(params, '-_id servant_id date mode map queue score').sort({date: 1}).exec()
})
