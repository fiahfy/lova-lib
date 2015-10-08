'use strict';

let client = require('cheerio-httpcli');
let logger = require('../logger');

// set ua
client.setBrowser('chrome');
client.headers['User-Agent'] += ' Lova Scraper Client/1.0.0';

function fetch(url) {
  logger.info('fetch url: url = %s', url);
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

module.exports = {
  fetch:               fetch,
  fetchArticle:        fetchArticle,
  fetchNotice:         fetchNotice,
  fetchServant:        fetchServant,
  fetchAllServantList: fetchAllServantList
};
