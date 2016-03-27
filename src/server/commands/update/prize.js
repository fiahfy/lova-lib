import moment from 'moment'
import logger from '../../utils/logger'
import * as scraper from '../../utils/scraper'
import * as models from '../../models'

const fetchMaxPage = 5

export default function(force) {
  return new Promise(async function(resolve, reject) {
    try {
      // get prizes
      const prizes = await fetchPrizes()
      if (!prizes.length) {
        throw new Error('Prize is Nothing')
      }

      // check exists if not force update
      if (!force) {
        const date = prizes[0].date
        const results = await findPrizes({date})
        if (results.length) {
          logger.verbose('Prize is Almost Exists: date = %s',
            moment.utc(date).format('YYYY-MM-DD'))
          resolve()
          return
        }
      }

      // check summary rate
      const summary = prizes.reduce((p, c) => (p + c.rate * 100), 0) / 100
      const methodName = summary === 1 ? 'info' : 'warn'
      logger[methodName]('Total Rate Summary: summary = %s', summary.toFixed(2))

      // clean prizes
      logger.info('Truncate Prizes')
      await truncatePrizes()

      // insert prizes
      logger.info('Insert Prizes: count = %d', prizes.length)
      await insertPrizes(prizes)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

async function findPrizes(args) {
  return await models.prize.find(args).exec()
}

async function truncatePrizes() {
  await models.prize.remove({}).exec()
}

async function insertPrizes(prizes) {
  let i = 0
  for (let prize of prizes) {
    prize._id = ++i
    await insertPrize(prize)
  }
}

async function insertPrize(args) {
  const _id = args._id
  delete args._id
  return await models.prize.update({_id: _id}, args, {upsert: true}).exec()
}

async function fetchPrizes() {
  // get article id
  const id = await getRecentPrizeArticleId()
  if (!id) {
    throw new Error('Prize Notice is Not Found')
  }
  const $ = (await scraper.fetchArticle(id)).$
  const panel = $('#mainpanel')
  let date = new Date(panel.find('div.article_title span.date').text())
  date = moment.utc(date)
  const prizes = _.values($('.subsection_frame').find('table>tbody>tr')).reduce((previous, current) => {
    const name = $(current).find('td:first-child').text()
    const rate = $(current).find('td:last-child').text()
    const matches = _.trim(rate).match(/^([\d\.]+)[%％]$/i)
    if (!matches) {
      return previous
    }
    previous.push({
      date,
      name,
      rate: Number(matches[1]) / 100
    })
    return previous
  }, [])
  return prizes
}

async function getRecentPrizeArticleId() {
  for (let i = 1; i <= fetchMaxPage; i++) {
    const $ = (await scraper.fetchNotice(i)).$
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
}
