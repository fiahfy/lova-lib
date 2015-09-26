'use strict';

var co = require('co');
var scraper = require('../scrapers');
var models = require('../../models');

const fetchMaxPage = 5;

module.exports = function() {
  return co(function *() {
    // get article id
    var id = yield getRecentPrizeArticleId();
    if (!id) {
      console.log('prize notice is not found');
      return;
    }
    // get prizes
    var prizes = yield getPrizesWithArticleId(id);
    if (!prizes) {
      console.log('prize notice parse error');
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

function insertPrize(prize) {
  var _id = prize._id;
  delete prize._id;

  return models.prize.update({_id: _id}, prize, {upsert: true}).exec();
}

function truncatePrizes() {
  return models.prize.remove({}).exec();
}

function getPrizesWithArticleId(id) {
  return co(function *() {
    var $ = (yield scraper.fetchArticle(id)).$;
    var prizes = [];
    var date = new Date($('#mainpanel').find('div.article_title span.date').text());
    $('#mainpanel').find('div.subsection_frame strong').each(function() {
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
