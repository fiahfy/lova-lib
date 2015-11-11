'use strict';

let client = require('cheerio-httpcli');
let logger = require('./logger');

// set ua
client.setBrowser('chrome');
client.headers['User-Agent'] += ' Lova Scraper Client/1.0.0';

const lovaSiteBasePath = 'http://lova.jp/';
const cacheSiteBasePath = 'http://cache.lova.jp/';
const wikiSiteBasePath = 'http://wiki.4gamer.net/lova/';

function fetch(url) {
  logger.verbose('Fetch Url: url = %s', url);
  return client.fetch(url);
}

function fetchArticle(id) {
  let url = `${lovaSiteBasePath}member/article.php`;
  if (id) {
    url += `?no=${id}`;
  }
  return fetch(url);
}

function fetchNotice(page) {
  let url = `${lovaSiteBasePath}member/notice.php`;
  if (page) {
    url += `?p=${page}`;
  }
  return fetch(url);
}

function fetchServant(tribe_name, name) {
  if (['ミミララ・レイア', 'ジャンヌ・ダルク'].indexOf(name) > -1) {
    name = name.replace('・', '');
  }
  let url = `${wikiSiteBasePath}%E4%BD%BF%E3%81%84%E9%AD%94/${encodeURIComponent(tribe_name)}/${encodeURIComponent(name)}`;
  return fetch(url);
}

function fetchAllServantList() {
  let url = `${wikiSiteBasePath}%E4%BD%BF%E3%81%84%E9%AD%94`;
  return fetch(url);
}

function fetchServantRanking(date, mode, map, queue) {
  let d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 1);
  let dateString = d.getUTCFullYear() + ('00' + (d.getUTCMonth() + 1)).slice(-2) + ('00' + d.getUTCDate()).slice(-2) + '0500';
  let path;
  switch (mode) {
    case 'win':
      path = 'servantWinRate_weekly';
      break;
    case 'used':
      path = 'servantUsedRate_weekly';
      break;
  }
  switch (`${map}-${queue}`) {
    case 'all-all':
      path += '_all_all_all';
      break;
    case 'all-normal':
      path += '_all_normal_all';
      break;
    case 'all-solo':
      path += '_all_league_all';
      break;
    case 'vermilion-all':
      path += '_7vs7_all_all';
      break;
    case 'vermilion-normal':
      path += '_7vs7_normal_all';
      break;
    case 'vermilion-solo':
      path += '_7vs7_league_all';
      break;
    case 'braze-all':
      path += '_5vs5_all_all';
      break;
    case 'braze-normal':
      path += '_5vs5_normal_all';
      break;
    case 'braze-solo':
      path += '_5vs5_league_all';
      break;
    default:
      return null;
  }
  let url = `${cacheSiteBasePath}ranking/${path}/${dateString}/page1.json`;
  return fetch(url);
}

module.exports = {
  fetch:               fetch,
  fetchArticle:        fetchArticle,
  fetchNotice:         fetchNotice,
  fetchServant:        fetchServant,
  fetchAllServantList: fetchAllServantList,
  fetchServantRanking: fetchServantRanking
};
