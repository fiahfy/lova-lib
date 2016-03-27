import moment from 'moment'
import client from 'cheerio-httpcli'
import logger from './logger'

// set ua
client.setBrowser('chrome')
client.headers['User-Agent'] += ' Lova Scraper Client/1.0.0'

const lovaSiteBasePath  = 'http://lova.jp/'
const cacheSiteBasePath = 'http://cache.lova.jp/'
const wikiSiteBasePath  = 'http://wiki.4gamer.net/lova/'

export function fetch(url) {
  logger.verbose('Fetch Url: url = %s', url)
  return client.fetch(url)
}

export function fetchArticle(id) {
  let url = `${lovaSiteBasePath}member/article.php`
  if (id) {
    url += `?no=${id}`
  }
  return fetch(url)
}

export function fetchNotice(page) {
  let url = `${lovaSiteBasePath}member/notice.php`
  if (page) {
    url += `?p=${page}`
  }
  return fetch(url)
}

export function fetchServant(tribe_name, name) {
  if (['ミミララ・レイア', 'ジャンヌ・ダルク'].indexOf(name) > -1) {
    name = name.replace('・', '')
  }
  const url = `${wikiSiteBasePath}%E4%BD%BF%E3%81%84%E9%AD%94/${encodeURIComponent(tribe_name)}/${encodeURIComponent(name)}`
  return fetch(url)
}

export function fetchAllServantList() {
  const url = `${wikiSiteBasePath}%E4%BD%BF%E3%81%84%E9%AD%94`
  return fetch(url)
}

export function fetchServantRanking(date, mode, map, queue) {
  const d = moment.utc(date).add(1, 'days')
  let dateString = d.format('YYYYMMDD')
  if (dateString > '20160316') {
    dateString += '0430'
  } else if (dateString > '20160201') {
    dateString += '0300'
  } else {
    dateString += '0500'
  }
  let path
  switch (mode) {
  case 'win':
    path = 'servantWinRate_weekly'
    break
  case 'usage':
    path = 'servantUsedRate_weekly'
    break
  }
  switch (map) {
  case 'all':
    path += '_all'
    break
  case 'vermilion':
    path += '_7vs7'
    break
  case 'braze':
    path += '_5vs5'
    break
  }
  switch (queue) {
  case 'all':
    path += '_all'
    break
  case 'normal':
    path += '_normal'
    break
  case 'solo':
    path += '_league'
    break
  }
  path += '_all'
  const url = `${cacheSiteBasePath}ranking/${path}/${dateString}/page1.json`
  return fetch(url)
}

export function fetchSpellRanking(date, map, queue) {
  const d = moment.utc(date).add(1, 'days')
  let dateString = d.format('YYYYMMDD')
  if (dateString > '20160317') {
    dateString += '0430'
  } else if (dateString > '20160201') {
    dateString += '0300'
  } else {
    dateString += '0500'
  }
  let path = 'ultimatespell_weekly'
  switch (map) {
  case 'all':
    path += '_all'
    break
  case 'vermilion':
    path += '_7vs7'
    break
  case 'braze':
    path += '_5vs5'
    break
  }
  switch (queue) {
  case 'all':
    path += '_all'
    break
  case 'normal':
    path += '_normal'
    break
  case 'solo':
    path += '_league'
    break
  }
  path += '_all'
  const url = `${cacheSiteBasePath}ranking/${path}/${dateString}/page1.json`
  return fetch(url)
}

export async function fetchCombinationRanking(date, tribe) {
  const d = moment.utc(date).add(1, 'days')
  let dateString = d.format('YYYYMMDD')
  if (dateString > '20160317') {
    dateString += '0430'
  } else {
    dateString += '0300'
  }
  const path = 'servantDeck_weekly_' + tribe
  const url = `${cacheSiteBasePath}ranking/${path}/${dateString}/page1.json`
  return await fetch(url)
}
