'use strict';

let co = require('co');
let fs = require('fs');
let request = require('request');
let config = require('../../config/app');
let lwip = config.development ? require('lwip') : undefined;
let logger = require('../../utils/logger');
let scraper = require('../../utils/scraper');
let models = require('../../models');

const imageDir = './client/assets/img/';

module.exports = function(id, force) {
  return co(function *() {
    let servants;
    if (id) {
      servants = yield findServants({_id: id});
    } else {
      servants = yield findServants({});
    }
    for (let i = 0; i < servants.length; i++) {
      yield save(servants[i], force);
    }
  });
};

function findServants(args) {
  return models.servant.find(args).sort({_id: 1}).exec();
}

function save(servant, force) {
  return co(function *() {
    logger.verbose('Begin Download Servant Image: id = %d', servant.id);

    let clipImagePath = `${imageDir}clip/${servant.id}.jpg`;
    let largeImagePath = `${imageDir}l/${servant.id}.jpg`;
    let middleImagePath = `${imageDir}m/${servant.id}.jpg`;

    if (!force && (yield exists(clipImagePath)) && (yield exists(largeImagePath)) && (yield exists(middleImagePath))) {
      logger.verbose('Image File is Almost Exists');
      return;
    }

    let clipUrl = yield getClipImageUrlWithServant(servant);
    let url = yield getImageUrlWithServant(servant);
    if (!clipUrl || !url) {
      throw new Error('Image Url is Not Found');
    }

    yield download(clipUrl, clipImagePath);

    yield download(url, largeImagePath);

    yield scale(largeImagePath, middleImagePath, 150 / 640);

    yield compress(middleImagePath, middleImagePath, {quality: 50});
  });
}

function getImageUrlWithServant(servant) {
  return co(function *() {
    let $ = (yield scraper.fetchServant(servant.tribe_name, servant.name)).$;
    return $('#rendered-body').find('> div:first-child img').attr('src');
  });
}

function getClipImageUrlWithServant(servant) {
  return co(function *() {
    let $ = (yield scraper.fetchAllServantList()).$;
    let tribeNameAndCode = `${servant.tribe_name}-${('000'+servant.tribe_code).slice(-3)}`;
    return $('#content_1001_1').next().next()
      .find(`table tbody tr td:contains(${tribeNameAndCode})`).prev().prev()
      .find('a img').attr('src');
  });
}

function exists(path) {
  return new Promise(function(resolve, reject) {
    fs.stat(path, function(err, stat) {
      if (err == null) {
        resolve(true);
        return;
      }
      resolve(false);
    });
  });
}

function download(url, path) {
  return new Promise(function(resolve, reject) {
    logger.verbose('Download Image: url = %s', url);

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

function compress(orgPath, distPath, params) {
  return new Promise(function(resolve, reject) {
    lwip.open(orgPath, function(err, image) {
      image.toBuffer('jpg', {quality: 50}, function(err, buffer) {
        lwip.open(buffer, 'jpg', function(err, image) {
          image.writeFile(distPath, 'jpg', {}, function (err) {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        });
      });
    });
  });
}
