import co from 'co'
import logger from '../../utils/logger'
import * as scraper from '../../utils/scraper'
import * as models from '../../models'

const fetchMaxPage = 5

export default function(force) {
  return co(function *() {
    // get prizes
    let prizes = yield getPrizes()
    if (!prizes.length) {
      throw new Error('Prize is Nothing')
    }

    // check exists if not force update
    if (!force) {
      const date = prizes[0].date
      const results = yield findPrizes({date: date})
      if (results.length) {
        logger.verbose('Prize is Almost Exists: date = %s', date.toUTCString())
        return
      }
    }

    let summary = prizes.reduce((p, c) => (p + c.rate * 100), 0) / 100
    logger[summary === 1 ? 'info' : 'warn']('Total Rate Summary: summary = %s', summary.toFixed(2))

    // clean prizes
    logger.info('Truncate Prizes')
    yield truncatePrizes()

    // insert prizes
    logger.info('Insert Prizes: count = %d', prizes.length)
    yield insertPrizes(prizes)
  })
}

function findPrizes(args) {
  return models.prize.find(args).exec()
}

function insertPrizes(prizes) {
  return co(function *() {
    let i = 0
    for (let prize of prizes) {
      prize._id = ++i
      yield insertPrize(prize)
    }
  })
}

function insertPrize(args) {
  const _id = args._id
  delete args._id
  return models.prize.update({_id: _id}, args, {upsert: true}).exec()
}

function truncatePrizes() {
  return models.prize.remove({}).exec()
}

function getPrizes() {
  return co(function *() {
    // get article id
    const id = yield getRecentPrizeArticleId()
    if (!id) {
      throw new Error('Prize Notice is Not Found')
    }
    const $ = (yield scraper.fetchArticle(id)).$
    const panel = $('#mainpanel')
    // const text = panel.find('div.subsection_frame').text()
    // const matches = text.match(/・([^：]+)：([^%％]+)[%％]/gi)
    // if (!matches.length) {
    //   return []
    // }
    // let date = new Date(panel.find('div.article_title span.date').text())
    // date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    // let prizes = []
    // for (let matchText of matches) {
    //   const ms = matchText.match(/・([^：]+)：([^%％]+)[%％]/i)
    //   if (ms) {
    //     prizes.push({
    //       date: date,
    //       name: ms[1].trim(),
    //       rate: ms[2].trim() / 100
    //     })
    //   }
    // }
    let date = new Date(panel.find('div.article_title span.date').text())
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const prizes = _.values($('.subsection_frame').find('table>tbody>tr')).reduce((previous, current) => {
      const name = $(current).find('td:first-child').text()
      const rate = $(current).find('td:last-child').text()
      const matches = _.trim(rate).match(/^(\d+)[%％]$/i)
      if (!matches) {
        return previous
      }
      previous.push({
        date,
        name,
        rate: matches[1] / 100
      })
      return previous
    }, [])
    return prizes
  })
}

function getRecentPrizeArticleId() {
  return co(function *() {
    for (let i = 1; i <= fetchMaxPage; i++) {
      const $ = (yield scraper.fetchNotice(i)).$
      let id
      $('#information_panel').find('div.tab_topics ul.page_inner li a').each(function() {
        const title = $(this).find('span:last-child').text()
        if (title.match(/「転成儀」.*更新のお知らせ/i)) {
          id = $(this).attr('href').split('no=')[1]
          return false
        }
      })
      if (id) {
        return id
      }
    }
    return null
  })
}
