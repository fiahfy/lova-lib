'use strict';

var co = require('co');
var commander = require('commander');
var fs = require('fs');
var request = require('request');
var mongoose = require('mongoose');

var scraper = require('./server/libs/scraper');
var commands = require('./server/libs/commands');

var promise;

commander
  .command('servant [env]')
  .description('update for prizes')
  .option('-f, --force', 'update force')
  .action(function(env, opts){
    promise = commands.servant(env, opts.force);
  });
commander
  .command('prize')
  .description('update for prizes')
  .action(function(){
    promise = commands.prize();
  });
  //.arguments('<cmd> [env]')
  //.action(function(cmd, env, opts) {
  //  command = cmd;
  //  environment = env;
  //  options = opts;
  //})
commander
  .version('0.0.1')
  .parse(process.argv);

if (typeof promise === 'undefined') {
  commander.help();
}

promise.then(function(reason) {
    mongoose.disconnect();
  }, function(reason) {
    mongoose.disconnect();
    console.error(reason);
  }
);

//function clear(callback) {
//  return new Promise(function(resolve, reject) {
//    co(function *() {
//      yield db.truncate('servant');
//      yield db.truncate('status');
//      yield db.truncate('skill');
//    }).then(function() {
//      if (callback) {
//        callback();
//      }
//      resolve();
//    }, function(reason) {
//      if (callback) {
//        callback(reason.err);
//      }
//      reject(reason);
//    });
//  });
//}

//function migrate(callback) {
//  return new Promise(function(resolve, reject) {
//    co(function *() {
//      var servants = (yield sqlite.select('servant')).rows;
//      for (var i = 0; i < servants.length; i++) {
//        var servant = servants[i];
//        servant._id = servant.id;
//        yield db.upsert('servant', servant);
//      }
//
//    }).then(function() {
//      if (callback) {
//        callback();
//      }
//      resolve();
//    }, function(reason) {
//      if (callback) {
//        callback(reason.err);
//      }
//      reject(reason);
//    });
//  });
//}

function updateWithUrl(url, callback) {
  return new Promise(function(resolve, reject) {
    co(function *() {
      console.log('fetch url: url = %s', url);

      var servant = (yield scraper.scrapeServant(url)).servant;

      // get old servant id
      var rows = (yield db.select('servant', {race_name: servant.race_name, race_code: servant.race_code})).rows;
      if (rows[0]) {
        console.log('compare update date: %s <=> %s', servant.date, rows[0].date);
        if (servant.date <= rows[0].date) {
          // skip
          //console.log('skip update servant: id = %s, race_name = %s, race_code = %s, name = %s',
          //  servant._id, servant.race_name, servant.race_code, servant.name);
          //return;
        }
        // update servant
        servant._id = rows[0]._id;
        console.log('update servant: id = %s, race_name = %s, race_code = %s, name = %s',
          servant._id, servant.race_name, servant.race_code, servant.name);
      } else {
        // insert servant
        console.log('create servant: race_name = %s, race_code = %s, name = %s',
          servant.race_name, servant.race_code, servant.name);
      }
      yield db.upsert('servant', servant);

    }).then(function() {
      if (callback) {
        callback();
      }
      resolve();
    }, function(reason) {
      if (callback) {
        callback(reason.err);
      }
      reject(reason);
    });
  });
}

function updateAll(callback) {
  return new Promise(function(resolve, reject) {
    co(function *() {
      var urls = (yield scraper.scrapeServants(0, 0)).urls;
      for (var url of urls) {
        yield updateWithUrl(url);
      }
    }).then(function() {
      if (callback) {
        callback();
      }
      resolve();
    }, function(reason) {
      if (callback) {
        callback(reason.err);
      }
      reject(reason);
    });
  });
}

//function dump(callback) {
//  return new Promise(function(resolve, reject) {
//    co(function *() {
//      var servants = (yield db.select('servant')).rows;
//      for (var i = 0; i < servants.length; i++) {
//        servants[i].statuses = {};
//        var statuses = (yield db.select('status', {servant_id: servants[i].id})).rows;
//        for (var j = 0; j < statuses.length; j++) {
//          var status = statuses[j];
//          var level = status.level;
//          servants[i].statuses[level] = status;
//        }
//
//        servants[i].skills = {};
//        var skills = (yield db.select('skill', {servant_id: servants[i].id})).rows;
//        for (j = 0; j < skills.length; j++) {
//          var skill = skills[j];
//          var type = skill.type;
//          servants[i].skills[type] = skill;
//        }
//      }
//
//      yield write('./app/assets/data/servant.json', JSON.stringify(servants));
//
//    }).then(function() {
//      if (callback) {
//        callback();
//      }
//      resolve();
//    }, function(reason) {
//      if (callback) {
//        callback(reason.err);
//      }
//      reject(reason);
//    });
//  });
//}

function downloadImages(callback) {
  return new Promise(function(resolve, reject) {
    co(function *() {
      var servants = (yield db.select('servant')).rows;
      for (var i = 0; i < servants.length; i++) {
        yield downloadServantImage(servants[i]);
      }
    }).then(function() {
      if (callback) {
        callback();
      }
      resolve();
    }, function(reason) {
      if (callback) {
        callback(reason.err);
      }
      reject(reason);
    });
  });
}

function downloadServantImage(servant, callback) {
  return new Promise(function(resolve, reject) {
    co(function *() {
      yield download(servant.image_l_url, './app/assets/img/l/' + servant.id + '.jpg');
      yield download(servant.image_m_url, './app/assets/img/m/' + servant.id + '.jpg');
    }).then(function() {
      if (callback) {
        callback();
      }
      resolve();
    }, function(reason) {
      if (callback) {
        callback(reason.err);
      }
      reject(reason);
    });
  });
}

function download(url, path) {
  return new Promise(function(resolve, reject) {
    console.log('download url: %s', url);

    request
      .get(url)
      .on('response', function(res) {
        console.log('statusCode: ', res.statusCode);
        console.log('content-length: ', res.headers['content-length']);
        resolve();
      })
      .pipe(fs.createWriteStream(path));
  });
}

//function write(path, data) {
//  return new Promise(function(resolve, reject) {
//    fs.writeFile(path, data, function(err) {
//      if (err) {
//        reject(err);
//        return;
//      }
//      resolve();
//    });
//  });
//}

