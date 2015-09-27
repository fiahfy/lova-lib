'use strict';

var co = require('co');
var scraper = require('../../scrapers/index');
var models = require('../../../models/index');

const fetchMaxPage = 5;

module.exports = function() {
  return co(function *() {
    // get prizes
    var prizes = yield getPrizes();
    if (!prizes) {
      console.log('prize is nothing');
      return;
    }
    // clean prizes
    console.log('truncate prizes');
    yield truncatePrizes();
    // insert prizes
    console.log('insert prizes: count = %d', prizes.length);
    yield insertPrizes(prizes);
  });
};

function insertPrizes(prizes) {
  return co(function *() {
    for (var i = 0; i < prizes.length; i++) {
      var prize = prizes[i];
      prize._id = i + 1;
      yield insertPrize(prize);
    }
  });
}

function insertPrize(args) {
  var _id = args._id;
  delete args._id;
  return models.prize.update({_id: _id}, args, {upsert: true}).exec();
}

function truncatePrizes() {
  return models.prize.remove({}).exec();
}

function getPrizes() {
  return co(function *() {
    // get article id
    var id = yield getRecentPrizeArticleId();
    if (!id) {
      console.log('prize notice is not found');
      return null;
    }
    var $ = (yield scraper.fetchArticle(id)).$;
    var prizes = [];
    var panel = $('#mainpanel');
    var date = new Date(panel.find('div.article_title span.date').text());
    panel.find('div.subsection_frame strong').each(function() {
      var text = $(this).text();
      var matches = text.match(/([^・：]+)：(.+)[%％]/i);
      if (matches) {
        prizes.push({
          date: date,
          name: matches[1].trim(),
          rate: matches[2].trim() / 100
        });
      }
    });
    return prizes;
  });
}

function getRecentPrizeArticleId() {
  return co(function *() {
    for (var i = 1; i <= fetchMaxPage; i++) {
      var $ = (yield scraper.fetchNotice(i)).$;
      var id;
      $('#information_panel').find('div.tab_topics ul.page_inner li a').each(function() {
        var title = $(this).find('span:last-child').text();
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
