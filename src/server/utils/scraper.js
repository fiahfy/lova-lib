import client from 'cheerio-httpcli'
import logger from './logger'

// set ua
client.setBrowser('chrome')
client.headers['User-Agent'] += ' Lova Scraper Client/1.0.0'

const lovaSiteBasePath = 'http://lova.jp/'
const cacheSiteBasePath = 'http://cache.lova.jp/'
const wikiSiteBasePath = 'http://wiki.4gamer.net/lova/'

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
  let url = `${wikiSiteBasePath}%E4%BD%BF%E3%81%84%E9%AD%94/${encodeURIComponent(tribe_name)}/${encodeURIComponent(name)}`
  return fetch(url)
}

export function fetchAllServantList() {
  let url = `${wikiSiteBasePath}%E4%BD%BF%E3%81%84%E9%AD%94`
  return fetch(url)
}

export function fetchServantRanking(date, mode, map, queue) {
  let d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  d.setUTCDate(d.getUTCDate() + 1)
  let dateString = d.getUTCFullYear() + ('00' + (d.getUTCMonth() + 1)).slice(-2) + ('00' + d.getUTCDate()).slice(-2) + '0500'
  let path
  switch (mode) {
    case 'win':
      path = 'servantWinRate_weekly'
      break
    case 'used':
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
  let url = `${cacheSiteBasePath}ranking/${path}/${dateString}/page1.json`
  return fetch(url)
}

export function fetchSpellRanking(date, map, queue) {
  let d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  d.setUTCDate(d.getUTCDate() + 1)
  let dateString = d.getUTCFullYear() + ('00' + (d.getUTCMonth() + 1)).slice(-2) + ('00' + d.getUTCDate()).slice(-2) + '0500'
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
  let url = `${cacheSiteBasePath}ranking/${path}/${dateString}/page1.json`
  return fetch(url)
}
