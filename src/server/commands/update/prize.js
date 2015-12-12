'use strict';

let co = require('co');
let logger = require('../../utils/logger');
let scraper = require('../../utils/scraper');
let models = require('../../models');

const fetchMaxPage = 5;

module.exports = function(force) {
  return co(function *() {
    // get prizes
    let prizes = yield getPrizes();
    if (!prizes.length) {
      throw new Error('Prize is Nothing');
    }

    // check exists if not force update
    if (!force) {
      let date = prizes[0].date;
      let results = yield findPrizes({date: date});
      if (results.length) {
        logger.verbose('Prize is Almost Exists: date = %s', date.toUTCString());
        return;
      }
    }

    let summary = prizes.reduce((p, c) => { return p + c.rate * 100; }, 0) / 100;
    logger[summary === 1 ? 'info' : 'warn']('Total Rate Summary: summary = %s', summary.toFixed(2));

    // clean prizes
    logger.info('Truncate Prizes');
    yield truncatePrizes();

    // insert prizes
    logger.info('Insert Prizes: count = %d', prizes.length);
    yield insertPrizes(prizes);
  });
};

function findPrizes(args) {
  return models.prize.find(args).exec();
}

function insertPrizes(prizes) {
  return co(function *() {
    for (let prize of prizes) {
      prize._id = i + 1;
      yield insertPrize(prize);
    }
  });
}

function insertPrize(args) {
  let _id = args._id;
  delete args._id;
  return models.prize.update({_id: _id}, args, {upsert: true}).exec();
}

function truncatePrizes() {
  return models.prize.remove({}).exec();
}

function getPrizes() {
  return co(function *() {
    // get article id
    let id = yield getRecentPrizeArticleId();
    if (!id) {
      throw new Error('Prize Notice is Not Found');
    }
    let $ = (yield scraper.fetchArticle(id)).$;
    let prizes = [];
    let panel = $('#mainpanel');
    let date = new Date(panel.find('div.article_title span.date').text());
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    let text = panel.find('div.subsection_frame').text();
    let matches = text.match(/・([^：]+)：([^%％]+)[%％]/gi);
    if (!matches.length) {
      return [];
    }
    for (let matchText of matches) {
      let ms = matchText.match(/・([^：]+)：([^%％]+)[%％]/i);
      if (ms) {
        prizes.push({
          date: date,
          name: ms[1].trim(),
          rate: ms[2].trim() / 100
        });
      }
    }
    return prizes;
  });
}

function getRecentPrizeArticleId() {
  return co(function *() {
    for (let i = 1; i <= fetchMaxPage; i++) {
      let $ = (yield scraper.fetchNotice(i)).$;
      let id;
      $('#information_panel').find('div.tab_topics ul.page_inner li a').each(function() {
        let title = $(this).find('span:last-child').text();
        if (title.match(/「転成儀」.*更新のお知らせ/i)) {
          id = $(this).attr('href').split('no=')[1];
          return false;
        }
      });
      if (id) {
        return id;
      }
    }
    return null;
  });
}
