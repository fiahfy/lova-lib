var co = require('co');
var client = require('cheerio-httpcli');

// set ua
client.setBrowser('chrome');
client.headers['User-Agent'] += ' Scraper/1.0.0';

function scrape(url, callback) {
  return new Promise(function(resolve, reject) {
    client.fetch(url, function (err, $, res, body) {
      if (err) {
        if (callback) {
          callback(err);
        }
        reject({err: err});
        return;
      }

      setTimeout(function() {
        if (callback) {
          callback(null, $, res, body);
        }
        resolve({err: null, $: $, res: res, body: body});
      }, 0);
    });
  });
}

function scrapeServant(url, callback) {
  return new Promise(function(resolve, reject) {
    co(function *() {
      var $;
      $ = (yield scrape(url)).$;
      var servant = getServant($);

      //$ = (yield scrape('http://wiki.4gamer.net/lova/%E4%BD%BF%E3%81%84%E9%AD%94/' + encodeURIComponent(servant.race_name))).$;
      //servant.image_m_url = getMiddleImageUrl($, servant);

      servant = fixServant(servant);

      return {servant: servant};

    }).then(function(reason) {
      if (callback) {
        callback(null, reason.servant);
      }
      resolve(reason);
    }, function(reason) {
      if (callback) {
        callback(reason.err);
      }
      reject(reason);
    });
  });
}

function getMiddleImageUrl($, servant) {
  var name = servant.name;
  name = name.replace('―', 'ー');
  if (name == '夜木沼伊緒') {
    name = '夜木沼_伊緒';
  }
  if (name == '澄原サトカ') {
    name = '澄原_サトカ';
  }
  if (name == 'ミミララ・レイア') {
    name = 'ミミララレイア';
  }
  if (name == 'ジャンヌ・ダルク') {
    name = 'ジャンヌダルク';
  }
  return $('.table_cap').find('img[title="' + name + '"]').attr('src');
}

function getServant($) {
  var section1 = $('#content_1001_1');
  var section2 = $('#content_1001_2');

  var table1 = $('.servant_table > div:nth-child(1) table');
  var table2 = $('.servant_table > div:nth-child(2) table');
  var table3 = section1.next().find('table');
  var table4 = section2.next().find('table');

  var raceParams = getRaceParam(table1.find('tr:nth-child(1) td:nth-child(2)').text());

  var servant = {};
  servant.race_id         = raceParams[0];
  servant.race_name       = raceParams[1];
  servant.race_code       = raceParams[2];
  servant.name            = $('#page-main-title').text().replace(/[（\(][^）\)]*[）\)]/i, '').trim();
  servant.type            = table1.find('tr:nth-child(1) td:nth-child(4)').text().trim();
  servant.cost            = Number(table1.find('tr:nth-child(2) td:nth-child(2)').text());
  servant.range           = Number(table1.find('tr:nth-child(2) td:nth-child(4)').text().replace(/^.*[（\(]([^）\)]*)[）\)].*$/i, '$1'));
  servant.date            = parseDateString($('.servant_table').prev().text().trim().replace(/^.*：.*：(\d+)$/i, '$1'));//.getTime();
  servant.illustration_by = table1.find('tr:nth-child(3) td:nth-child(2)').text().trim();
  servant.character_voice = table1.find('tr:nth-child(3) td:nth-child(4)').text().trim();
  servant.oral_tradition  = $('#content_1001_0').next().text();
  //servant.image_l_url     = $('#rendered-body').find('> div:first-child img').attr('src');

  var status = {1: {}, 20: {}};
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

  var skill = {active: null, passive: null};
  if (section1[0]) {
    skill.active = {};
    skill.active.name         = section1.text().split('：')[1].trim();
    skill.active.description  = section1.next().next().text().replace(/<br\s*\/?>/gi, "\n").trim();
    skill.active.designation  = table3.find('tr:nth-child(1) td:nth-child(2)').text().replace(/[・･]/ig, ',').trim();
    skill.active.effect       = table3.find('tr:nth-child(1) td:nth-child(4)').text().replace(/[・･]/ig, ',').trim();
    skill.active.ap           = table3.find('tr:nth-child(2) td:nth-child(2)').text().replace(/\s*\/\s*/ig, ',').trim().split(',');
    skill.active.cd           = table3.find('tr:nth-child(2) td:nth-child(4)').text().replace(/\s*\/\s*/ig, ',').trim().split(',');
  }
  if (section2[0]) {
    skill.passive = {};
    skill.passive.name        = section2.text().split('：')[1].trim();
    skill.passive.description = section2.next().next().text().replace(/<br\s*\/?>/gi, "\n").trim();
    skill.passive.designation = table4.find('tr:nth-child(1) td:nth-child(2)').text().replace(/[・･]/ig, ',').trim();
    skill.passive.effect      = table4.find('tr:nth-child(1) td:nth-child(4)').text().replace(/[・･]/ig, ',').trim();
    skill.passive.ap          = [];
    skill.passive.cd          = [];
  }
  servant.skill = skill;

  return servant;
}

function scrapeServants(race_id, race_code, callback) {
  return new Promise(function(resolve, reject) {
    client.fetch('http://wiki.4gamer.net/lova/%E4%BD%BF%E3%81%84%E9%AD%94', function (err, $, res, body) {
      if (err) {
        if (callback) {
          callback(err);
        }
        reject({err: err});
        return;
      }

      var urls = [];
      $('#content_1001_1').next().next().find('table tbody tr').each(function() {
        var raceParams = getRaceParam($(this).find('td:nth-child(3)').text());
        if (raceParams[0] < race_id) {
          return;
        }
        if (raceParams[0] === race_id && raceParams[2] < race_code) {
          return;
        }
        urls.push('http://wiki.4gamer.net' + $(this).find('td:nth-child(2) a').attr('href'));
      });

      if (callback) {
        callback(null, urls);
      }
      resolve({err: null, urls: urls});
    });
  });
}

function fixServant(servant) {
  // adjust name
  servant.name = servant.name.replace('―', 'ー');
  // fix servant race
  if (servant.name === 'カイナッツォ') {
    servant.race_name = '海種';
    servant.race_code = 4;
  }
  if (servant.name === 'シェラハ') {
    servant.race_name = '海種';
    servant.race_code = 20;
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
  for (var type of ['active', 'passive']) {
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
  for (var level of [1, 20]) {
    if (!servant.status[level]) {
      continue
    }
    if (isNaN(servant.status[level].hp)) {
      servant.status[level] = null;
    }
  }
  return servant;
}

function parseDateString(input) {
  return new Date(Number(input.slice(0, 4)), Number(input.slice(4, 6)) - 1, Number(input.slice(6, 8)));
}

function getRaceParam(input) {
  var args = input.split('-');
  return [[, '人獣', '神族', '魔種', '海種', '不死'].indexOf(args[0]), args[0], Number(args[1])];
}

module.exports = {
  scrapeServant: scrapeServant,
  scrapeServants: scrapeServants
};
