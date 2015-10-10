'use strict';

let client = require('cheerio-httpcli');
let logger = require('../logger');

// set ua
client.setBrowser('chrome');
client.headers['User-Agent'] += ' Lova Scraper Client/1.0.0';

function fetch(url) {
  logger.verbose('Fetch Url: url = %s', url);
  return client.fetch(url);
}

function fetchArticle(id) {
  let url = 'http://lova.jp/member/article.php';
  if (id) {
    url += `?no=${id}`;
  }
  return fetch(url);
}

function fetchNotice(page) {
  let url = 'http://lova.jp/member/notice.php';
  if (page) {
    url += `?p=${page}`;
  }
  return fetch(url);
}

function fetchServant(tribe_name, name) {
  if (['ミミララ・レイア', 'ジャンヌ・ダルク'].indexOf(name) > -1) {
    name = name.replace('・', '');
  }
  let url = `http://wiki.4gamer.net/lova/%E4%BD%BF%E3%81%84%E9%AD%94/${encodeURIComponent(tribe_name)}/${encodeURIComponent(name)}`;
  return fetch(url);
}

function fetchAllServantList() {
  let url = 'http://wiki.4gamer.net/lova/%E4%BD%BF%E3%81%84%E9%AD%94';
  return fetch(url);
}

function fetchServantWinRanking(date) {
  let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setDate(d.getDate() + 1);
  var dateString = d.getFullYear() + ('00' + (d.getMonth() + 1)).slice(-2) + ('00' + d.getDate()).slice(-2) + '0500';
  let url = `http://cache.lova.jp/ranking/servantWinRate_weekly_all_all_all/${dateString}/page1.json`;
  return fetch(url);
}

function fetchServantUsedRanking(date) {
  let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setDate(d.getDate() + 1);
  var dateString = d.getFullYear() + ('00' + (d.getMonth() + 1)).slice(-2) + ('00' + d.getDate()).slice(-2) + '0500';
  let url = `http://cache.lova.jp/ranking/servantUsedRate_weekly_all_all_all/${dateString}/page1.json`;
  return fetch(url);
}

module.exports = {
  fetch:                   fetch,
  fetchArticle:            fetchArticle,
  fetchNotice:             fetchNotice,
  fetchServant:            fetchServant,
  fetchAllServantList:     fetchAllServantList,
  fetchServantWinRanking:  fetchServantWinRanking,
  fetchServantUsedRanking: fetchServantUsedRanking
};
