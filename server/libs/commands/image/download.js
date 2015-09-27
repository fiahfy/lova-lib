'use strict';

var co = require('co');
var fs = require('fs');
var request = require('request');
var lwip = require('lwip');
var scraper = require('../../scrapers/index');
var models = require('../../../models/index');

const imageDir = './client/assets/img/';

module.exports = function(id) {
  return co(function *() {
    var servants;
    if (id) {
      servants = yield findServants({_id: id});
    } else {
      servants = yield findServants({});
    }
    for (var i = 0; i < servants.length; i++) {
      yield save(servants[i]);
    }
  });
};

function findServants(args) {
  return models.servant.find(args).sort({_id: 1}).exec();
}

function save(servant) {
  return co(function *() {
    console.log('save image: id = %d', servant.id);
    var url = yield getImageUrlWithServant(servant);
    if (!url) {
      console.log('image url is not found');
      return;
    }

    var largeImagePath = `${imageDir}l/${servant.id}.jpg`;
    var middleImagePath = `${imageDir}m/${servant.id}.jpg`;

    yield download(url, largeImagePath);

    yield scale(largeImagePath, middleImagePath, 150 / 640);
  });
}

function getImageUrlWithServant(servant) {
  return co(function *() {
    var $ = (yield scraper.fetchServant(servant.race_name, servant.name)).$;
    return $('#rendered-body').find('> div:first-child img').attr('src');
  });
}

function download(url, path) {
  return new Promise(function(resolve, reject) {
    console.log('download url: %s', url);

    request
      .get(url)
      //.on('response', function(res) {
      //  console.log('statusCode: ', res.statusCode);
      //  console.log('content-length: ', res.headers['content-length']);
      //})
      .pipe(fs.createWriteStream(path).on('close', function() {
        resolve();
      }));
  });
}

function scale(orgPath, distPath, ratio) {
  return new Promise(function(resolve, reject) {
    lwip.open(orgPath, function(err, image) {
      image.batch().scale(ratio, ratio, 'lanczos').writeFile(distPath, 'jpg', {}, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}
