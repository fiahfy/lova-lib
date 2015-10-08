'use strict';

let co = require('co');
let scraper = require('../../utils/scrapers');
let models = require('../../models');
let logger = require('../../utils/logger');

module.exports = function(url, force) {
  return co(function *() {
    if (url) {
      yield updateOne(url, force);
      return;
    }

    let urls = yield getServantUrls();
    for (let i = 0; i < urls.length; i++) {
      yield updateOne(urls[i], force);
    }
  });
};

function updateOne(url, force) {
  return co(function *() {
    // get servant
    let servant = yield getServantWithUrl(url);
    // find servant
    let row = yield findServant({tribe_name: servant.tribe_name, tribe_code: servant.tribe_code});
    if (row) {
      logger.info('compare update date: %j > %j', servant.date+'', row.date+'');
      if (servant.date <= row.date && !force) {
        logger.info('skip update servant: id = %s, tribe_name = %s, tribe_code = %s, name = %s',
          row._id, servant.tribe_name, servant.tribe_code, servant.name);
        return;
      }
      servant._id = row._id;
      logger.info('update servant: id = %s, tribe_name = %s, tribe_code = %s, name = %s',
        servant._id, servant.tribe_name, servant.tribe_code, servant.name);
      yield updateServant(servant);
    } else {
      logger.info('create servant: tribe_name = %s, tribe_code = %s, name = %s',
        servant.tribe_name, servant.tribe_code, servant.name);
      yield insertServant(servant);
    }
  });
}

function findServant(args) {
  return models.servant.findOne(args).exec();
}

function insertServant(args) {
  return co(function *() {
    let result = (yield models.counter.getNewId('servant')).result;
    let _id = result.value.seq;
    yield models.servant.update({_id: _id}, args, {upsert: true}).exec();
  });
}

function updateServant(args) {
  let _id = args._id;
  delete args._id;
  return models.servant.update({_id: _id}, args, {upsert: true}).exec();
}

function getServantUrls() {
  return co(function *() {
    let $ = (yield scraper.fetchAllServantList()).$;

    let urls = [];
    $('#content_1001_1').next().next().find('table tbody tr').each(function() {
      //let tribeParams = getTribeParam($(this).find('td:nth-child(3)').text());
      //if (tribeParams[0] < tribe_id) {
      //  return;
      //}
      //if (tribeParams[0] === tribe_id && tribeParams[2] < tribe_code) {
      //  return;
      //}
      urls.push('http://wiki.4gamer.net' + $(this).find('td:nth-child(2) a').attr('href'));
    });
    return urls;
  });
}

function getServantWithUrl(url) {
  return co(function *() {
    let $ = (yield scraper.fetch(url)).$;

    let section1 = $('#content_1001_1');
    let section2 = $('#content_1001_2');

    let table1 = $('.servant_table > div:nth-child(1) table');
    let table2 = $('.servant_table > div:nth-child(2) table');
    let table3 = section1.nextAll('.table-type-1').first().find('table');
    let table4 = section2.nextAll('.table-type-1').first().find('table');

    let tribeParams = getTribeParam(table1.find('tr:nth-child(1) td:nth-child(2)').text());

    let servant = {};
    servant.tribe_id         = tribeParams[0];
    servant.tribe_name       = tribeParams[1];
    servant.tribe_code       = tribeParams[2];
    servant.name            = $('#page-main-title').text().replace(/[（\(][^）\)]*[）\)]/i, '').trim();
    servant.type            = table1.find('tr:nth-child(1) td:nth-child(4)').text().trim();
    servant.cost            = Number(table1.find('tr:nth-child(2) td:nth-child(2)').text());
    servant.range           = Number(table1.find('tr:nth-child(2) td:nth-child(4)').text().replace(/^.*[（\(]([^）\)]*)[）\)].*$/i, '$1'));
    servant.date            = parseDateString($('.servant_table').prev().text().trim().replace(/^.*：.*：(\d+)$/i, '$1'));
    servant.illustration_by = table1.find('tr:nth-child(3) td:nth-child(2)').text().trim();
    servant.character_voice = table1.find('tr:nth-child(3) td:nth-child(4)').text().trim();
    servant.oral_tradition  = $('#content_1001_0').next().text();

    let status = {1: {}, 20: {}};
    status[1].hp   = Number(table2.find('tr:nth-child(2) td:nth-child(2)').text());
    status[1].ap   = Number(table2.find('tr:nth-child(3) td:nth-child(2)').text());
    status[1].atk  = Number(table2.find('tr:nth-child(4) td:nth-child(2)').text());
    status[1].pow  = Number(table2.find('tr:nth-child(5) td:nth-child(2)').text());
    status[1].def  = Number(table2.find('tr:nth-child(6) td:nth-child(2)').text());
    status[1].res  = Number(table2.find('tr:nth-child(7) td:nth-child(2)').text());
    status[1].ms   = Number(table2.find('tr:nth-child(8) td:nth-child(2)').text());
    status[1].as   = Number(table2.find('tr:nth-child(9) td:nth-child(2)').text());
    status[20].hp  = Number(table2.find('tr:nth-child(2) td:nth-child(3)').text());
    status[20].ap  = Number(table2.find('tr:nth-child(3) td:nth-child(3)').text());
    status[20].atk = Number(table2.find('tr:nth-child(4) td:nth-child(3)').text());
    status[20].pow = Number(table2.find('tr:nth-child(5) td:nth-child(3)').text());
    status[20].def = Number(table2.find('tr:nth-child(6) td:nth-child(3)').text());
    status[20].res = Number(table2.find('tr:nth-child(7) td:nth-child(3)').text());
    status[20].ms  = Number(table2.find('tr:nth-child(8) td:nth-child(2)').text());
    status[20].as  = Number(table2.find('tr:nth-child(9) td:nth-child(3)').text());
    servant.status = status;

    let skill = {active: null, passive: null};
    if (section1[0]) {
      skill.active = {};
      skill.active.name         = section1.text().split('：')[1].trim();
      skill.active.description  = section1.nextAll('p').first().text().replace(/<br\s*\/?>/gi, "\n").trim();
      skill.active.designation  = table3.find('tr:nth-child(1) td:nth-child(2)').text().replace(/[・･]/ig, ',').trim();
      skill.active.effect       = table3.find('tr:nth-child(1) td:nth-child(4)').text().replace(/[・･]/ig, ',').trim();
      skill.active.ap           = table3.find('tr:nth-child(2) td:nth-child(2)').text().replace(/\s*\/\s*/ig, ',').trim().split(',');
      skill.active.cd           = table3.find('tr:nth-child(2) td:nth-child(4)').text().replace(/\s*\/\s*/ig, ',').trim().split(',');
    }
    if (section2[0]) {
      skill.passive = {};
      skill.passive.name        = section2.text().split('：')[1].trim();
      skill.passive.description = section2.nextAll('p').first().text().replace(/<br\s*\/?>/gi, "\n").trim();
      skill.passive.designation = table4.find('tr:nth-child(1) td:nth-child(2)').text().replace(/[・･]/ig, ',').trim();
      skill.passive.effect      = table4.find('tr:nth-child(1) td:nth-child(4)').text().replace(/[・･]/ig, ',').trim();
      skill.passive.ap          = [];
      skill.passive.cd          = [];
    }
    servant.skill = skill;

    servant = fixServant(servant);

    return servant;
  });
}

function parseDateString(input) {
  return new Date(Number(input.slice(0, 4)), Number(input.slice(4, 6)) - 1, Number(input.slice(6, 8)));
}

function getTribeParam(input) {
  let args = input.split('-');
  return [[, '人獣', '神族', '魔種', '海種', '不死'].indexOf(args[0]), args[0], Number(args[1])];
}

function fixServant(servant) {
  // adjust name
  servant.name = servant.name.replace('―', 'ー');
  // fix servant tribe
  if (servant.name === 'カイナッツォ') {
    servant.tribe_name = '海種';
    servant.tribe_code = 4;
  }
  if (servant.name === 'シェラハ') {
    servant.tribe_name = '海種';
    servant.tribe_code = 20;
  }
  // adjust illustration_by
  if (servant.illustration_by === '―') {
    servant.illustration_by = null;
  }
  // adjust character_voice
  if (servant.character_voice === '―') {
    servant.character_voice = null;
  }
  // fix skill
  for (let type of ['active', 'passive']) {
    if (!servant.skill[type]) {
      continue
    }
    if (['スキルなし', 'なし'].indexOf(servant.skill[type].name) > -1) {
      servant.skill[type] = null;
      continue;
    }
    if (servant.skill[type].ap.length !== 3) {
      servant.skill[type].ap = [];
    }
    if (servant.skill[type].cd.length !== 3) {
      servant.skill[type].cd = [];
    }
    if (servant.skill[type].designation === '―') {
      servant.skill[type].designation = null;
    }
  }
  // fix status
  for (let level of [1, 20]) {
    if (!servant.status[level]) {
      continue
    }
    if (isNaN(servant.status[level].hp)) {
      servant.status[level] = null;
    }
  }
  return servant;
}
