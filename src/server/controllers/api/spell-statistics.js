import * as models from '../../models'

export default (function *() {
  const ranking = yield models.spellRanking.findOne({}).sort({date: -1}).exec()
  let d = ranking.date || new Date()
  switch (this.query.term) {
    case 'day':
      break
    case 'month':
      d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 30))
  }

  let params = _.pick(this.query, (value, key) => {
    return ['servant_id', 'map', 'queue'].indexOf(key) > -1
  })
  params.date = {$gte: d}

  this.body = yield models.spellRanking.find(params, '-_id spell_id date map queue score').sort({date: 1}).exec()
})



// import moment from 'moment'
// import * as models from '../../models'
//
// const displayCount = 30
//
// export default (function *() {
//   const gap = getGap(this.query.term)
//   const beginDate = yield findBeginDate(gap)
//
//   const params = {
//     ...this.query,
//     date: {$gte: beginDate}
//   }
//   const rankings = yield findRankings(params)
//
//   this.body = getStatistics(rankings, gap)
// })
//
// function getGap(term) {
//   switch (term) {
//     case 'weekly':
//       return 7
//     case 'daily':
//     default:
//       return 1
//   }
// }
//
// function *findBeginDate(gap) {
//   const ranking = yield models.spellRanking.findOne().sort({date: -1}).exec()
//   const endDate = ranking ? ranking.date : moment.utc().startOf('day').toDate()
//   const beginDate = moment(endDate).utc().startOf('day')
//     .subtract(displayCount * gap, 'days').toDate()
//   return beginDate
// }
//
// function *findRankings(args) {
//   const params = _.pick(args, (value, key) => {
//     return ['spell_id', 'map', 'queue', 'date'].indexOf(key) > -1
//   })
//   return yield models.spellRanking
//     .find(params, '-_id spell_id date map queue score')
//     .exec()
// }
//
// function getStatistics(rankings, gap) {
//   const endDate = _.max(rankings, d => d.date).date
//
//   const scoreMap = rankings.reduce((previous, current) => {
//     previous.set(getScoreKey(current), current.score)
//     return previous
//   }, new Map)
//
//   let results = []
//   for (let i = 0; i < displayCount * gap; i += gap) {
//     for (let spellId of _.uniq(_.pluck(rankings, 'spell_id'))) {
//       for (let map of _.uniq(_.pluck(rankings, 'map'))) {
//         for (let queue of _.uniq(_.pluck(rankings, 'queue'))) {
//           const scores = _.range(i, i + gap).map(i => {
//             const datum = {
//               date: moment(endDate).subtract(i, 'days').toDate(),
//               spell_id: spellId,
//               map,
//               queue
//             }
//             return scoreMap.get(getScoreKey(datum)) || null
//           }).filter(score => score !== null)
//
//           if (scores.length === 0) {
//             break
//           }
//
//           const score = scores.reduce((previous, current) => previous + current)
//             / scores.length
//
//           results.unshift({
//             date: moment(endDate).subtract(i, 'days').toDate(),
//             spell_id: spellId,
//             map,
//             queue,
//             score
//           })
//         }
//       }
//     }
//   }
//   return results
// }
//
// function getScoreKey(obj) {
//   return moment(obj.date).unix() + obj.spell_id + obj.map + obj.queue
// }
