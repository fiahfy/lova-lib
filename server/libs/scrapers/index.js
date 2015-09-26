'use strict';

var client = require('cheerio-httpcli');

// set ua
client.setBrowser('chrome');
client.headers['User-Agent'] += ' Lova Scraper Client/1.0.0';

function fetch(url) {
  console.log('fetch url: url = %s', url);
  return client.fetch(url);
}

function fetchArticle(id) {
  var url = 'http://lova.jp/member/article.php';
  if (id) {
    url += `?no=${id}`;
  }
  return fetch(url);
}

function fetchNotice(page) {
  var url = 'http://lova.jp/member/notice.php';
  if (page) {
    url += `?p=${page}`;
  }
  return fetch(url);
}

module.exports = {
  fetch:        fetch,
  fetchArticle: fetchArticle,
  fetchNotice:  fetchNotice
};