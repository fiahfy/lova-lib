import moment from 'moment'
import logger from'../../utils/logger'
import * as scraper from'../../utils/scraper'
import * as models from'../../models'
import * as ServantUtils from '../../../client/utils/servant-utils'

export default function(url, force) {
  return new Promise(async function(resolve, reject) {
    try {
      if (url) {
        await updateOne(url, force)
        resolve()
        return
      }

      let urls = await fetchServantUrls()
      for (let url of urls) {
        await updateOne(url, force)
      }
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

async function updateOne(url, force) {
  // get servant
  let servant = await fetchServantWithUrl(url)
  // find servant
  const row = await findServant({
    tribe_name: servant.tribe_name,
    tribe_code: servant.tribe_code
  })
  if (row) {
    logger.verbose('Compare Update Date: new = %j, current = %j',
      moment.utc(servant.update_date).format('YYYY-MM-DD'),
      moment.utc(row.update_date).format('YYYY-MM-DD'))
    if (servant.update_date <= row.update_date && !force) {
      logger.verbose('Skip Update Servant: id = %s, tribe_name = %s, tribe_code = %s, name = %s',
        row._id, servant.tribe_name, servant.tribe_code, servant.name)
      return
    }
    servant._id = row._id
    logger.info('Update Servant: id = %s, tribe_name = %s, tribe_code = %s, name = %s',
      servant._id, servant.tribe_name, servant.tribe_code, servant.name)
    await updateServant(servant)
  } else {
    logger.info('Create Servant: tribe_name = %s, tribe_code = %s, name = %s',
      servant.tribe_name, servant.tribe_code, servant.name)
    await insertServant(servant)
  }
}

async function findServant(args) {
  return await models.servant.findOne(args).exec()
}

async function insertServant(args) {
  const result = (await models.counter.getNewId('servant')).result
  const _id = result.value.seq
  return await models.servant.update({_id: _id}, args, {upsert: true}).exec()
}

async function updateServant(args) {
  const _id = args._id
  delete args._id
  return await models.servant.update({_id: _id}, args, {upsert: true}).exec()
}

async function fetchServantUrls() {
  const $ = (await scraper.fetchAllServantList()).$

  let urls = []
  $('#content_1001_1').next().next().find('table tbody tr').each(function() {
    // let [tribeId, tribeCode] = [3, 50]
    // let tribeParams = getTribeParam($(this).find('td:nth-child(3)').text())
    // if (tribeParams[0] < tribeId) {
    //  return
    // }
    // if (tribeParams[0] === tribeId && tribeParams[2] < tribeCode) {
    //  return
    // }
    urls.push('http://wiki.4gamer.net' + $(this).find('td:nth-child(2) a').attr('href'))
  })
  return urls
}

async function fetchServantWithUrl(url) {
  const $ = (await scraper.fetch(url)).$

  const section1 = $('#content_1001_1')
  const section2 = $('#content_1001_2')

  const table1 = $('.servant_table > div:nth-child(1) table')
  const table2 = $('.servant_table > div:nth-child(2) table')
  const table3 = section1.nextAll('.table-type-1').first().find('table')
  const table4 = section2.nextAll('.table-type-1').first().find('table')

  const tribeParams = getTribeParams(table1.find('tr:nth-child(1) td:nth-child(2)').text())

  let servant = {}
  servant.tribe_id         = tribeParams[0]
  servant.tribe_name       = tribeParams[1]
  servant.tribe_code       = tribeParams[2]
  servant.name            = $('#page-main-title').text().replace(/[（\(][^）\)]*[）\)]/i, '').trim()
  servant.type            = table1.find('tr:nth-child(1) td:nth-child(4)').text().trim()
  servant.cost            = Number(table1.find('tr:nth-child(2) td:nth-child(2)').text())
  servant.range           = Number(table1.find('tr:nth-child(2) td:nth-child(4)').text().replace(/^.*[（\(]([^）\)]*)[）\)].*$/i, '$1'))
  servant.release_date    = parseDateString($('.servant_table').prev().text().trim().replace(/^.*：([^\/\s]+).*：.*$/i, '$1'))
  servant.update_date     = parseDateString($('.servant_table').prev().text().trim().replace(/^.*：.*：(\d+)$/i, '$1'))
  servant.illustration_by = table1.find('tr:nth-child(3) td:nth-child(2)').text().trim()
  servant.character_voice = table1.find('tr:nth-child(3) td:nth-child(4)').text().trim()
  servant.oral_tradition  = $('#content_1001_0').next().text()

  let status = {1: {}, 20: {}}
  status[1].hp   = Number(table2.find('tr:nth-child(2) td:nth-child(2)').text())
  status[1].ap   = Number(table2.find('tr:nth-child(3) td:nth-child(2)').text())
  status[1].atk  = Number(table2.find('tr:nth-child(4) td:nth-child(2)').text())
  status[1].pow  = Number(table2.find('tr:nth-child(5) td:nth-child(2)').text())
  status[1].def  = Number(table2.find('tr:nth-child(6) td:nth-child(2)').text())
  status[1].res  = Number(table2.find('tr:nth-child(7) td:nth-child(2)').text())
  status[1].ms   = Number(table2.find('tr:nth-child(8) td:nth-child(2)').text())
  status[1].as   = Number(table2.find('tr:nth-child(9) td:nth-child(2)').text())
  status[20].hp  = Number(table2.find('tr:nth-child(2) td:nth-child(3)').text())
  status[20].ap  = Number(table2.find('tr:nth-child(3) td:nth-child(3)').text())
  status[20].atk = Number(table2.find('tr:nth-child(4) td:nth-child(3)').text())
  status[20].pow = Number(table2.find('tr:nth-child(5) td:nth-child(3)').text())
  status[20].def = Number(table2.find('tr:nth-child(6) td:nth-child(3)').text())
  status[20].res = Number(table2.find('tr:nth-child(7) td:nth-child(3)').text())
  status[20].ms  = Number(table2.find('tr:nth-child(8) td:nth-child(2)').text())
  status[20].as  = Number(table2.find('tr:nth-child(9) td:nth-child(3)').text())
  servant.status = status

  let skill = {active: null, passive: null}
  if (section1[0]) {
    skill.active = {}
    skill.active.name         = section1.text().split('：')[1].trim()
    skill.active.description  = section1.nextAll('p').first().text().replace(/<br\s*\/?>/gi, '\n').trim()
    skill.active.designation  = table3.find('tr:nth-child(1) td:nth-child(2)').text().replace(/[・･]/ig, ',').trim()
    skill.active.effect       = table3.find('tr:nth-child(1) td:nth-child(4)').text().replace(/[・･]/ig, ',').trim()
    skill.active.ap           = table3.find('tr:nth-child(2) td:nth-child(2)').text().replace(/\s*\/\s*/ig, ',').trim().split(',')
    skill.active.cd           = table3.find('tr:nth-child(2) td:nth-child(4)').text().replace(/\s*\/\s*/ig, ',').trim().split(',')
  }
  if (section2[0]) {
    skill.passive = {}
    skill.passive.name        = section2.text().split('：')[1].trim()
    skill.passive.description = section2.nextAll('p').first().text().replace(/<br\s*\/?>/gi, '\n').trim()
    skill.passive.designation = table4.find('tr:nth-child(1) td:nth-child(2)').text().replace(/[・･]/ig, ',').trim()
    skill.passive.effect      = table4.find('tr:nth-child(1) td:nth-child(4)').text().replace(/[・･]/ig, ',').trim()
    skill.passive.ap          = []
    skill.passive.cd          = []
  }
  servant.skill = skill

  servant = fixServant(servant)

  return servant
}

function parseDateString(str) {
  switch (str) {
  case 'α1':  str = '20141017'; break
  case 'α2':  str = '20141222'; break
  case 'CBT': str = '20150421'; break
  case 'OBT': str = '20150604'; break
  case '正式': str = '20150617'; break
  default: break
  }
  const date = moment.utc(str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8))
  if (!date.isValid()) {
    throw new Error('Invalid Date String: ' + str)
  }
  return date
}

function getTribeParams(input) {
  const args = input.split('-')
  return [ServantUtils.getTribeIdWithName(args[0]), args[0], Number(args[1])]
}

function fixServant(servant) {
  // adjust name
  servant.name = servant.name.replace('―', 'ー')

  // fix servant tribe
  if (servant.name === 'カイナッツォ') {
    servant.tribe_name = '海種'
    servant.tribe_id   = 4
    servant.tribe_code = 4
  }
  if (servant.name === 'シェラハ') {
    servant.tribe_name = '海種'
    servant.tribe_id   = 4
    servant.tribe_code = 20
  }
  if (servant.name === '水銀燈') {
    servant.tribe_name = '不死'
    servant.tribe_id   = 5
    servant.tribe_code = 46
  }
  if (servant.name === '使い魔/魔種/豆腐小僧') {
    servant.name = '豆腐小僧'
  }

  // adjust illustration_by
  if (servant.illustration_by === '―') {
    servant.illustration_by = null
  }
  // fix illustration_by
  if (servant.illustration_by.indexOf('キャラクター原案') > -1) {
    servant.illustration_by = servant.illustration_by.split('キャラクター原案')[0].trim()
  }
  // adjust character_voice
  if (servant.character_voice === '―') {
    servant.character_voice = null
  }
  // fix skill
  for (let type of ['active', 'passive']) {
    if (!servant.skill[type]) {
      continue
    }
    // name
    if (['スキルなし', 'なし'].indexOf(servant.skill[type].name) > -1) {
      servant.skill[type] = null
      continue
    }
    // ap
    servant.skill[type].ap = servant.skill[type].ap.filter(ap => {
      return ap.match(/^\d+$/)
    })
    if (servant.skill[type].ap.length !== 3) {
      servant.skill[type].ap = []
    }
    // cd
    servant.skill[type].cd = servant.skill[type].cd.filter(cd => {
      return cd.match(/^\d+$/)
    })
    if (servant.skill[type].cd.length !== 3) {
      servant.skill[type].cd = []
    }
    // designation
    if (servant.skill[type].designation === '―') {
      servant.skill[type].designation = null
    }
  }
  // fix status
  for (let level of [1, 20]) {
    if (!servant.status[level]) {
      continue
    }
    if (isNaN(servant.status[level].hp)) {
      servant.status[level] = null
    }
  }
  return servant
}
