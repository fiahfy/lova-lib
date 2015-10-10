'use strict';

let co = require('co');
let fs = require('fs');
let request = require('request');
//let lwip = require('lwip');
let scraper = require('../../utils/scrapers');
let models = require('../../models');

const imageDir = './client/assets/img/';

module.exports = function() {
  return co(function *() {
    let servants = yield findServants({});

    let tribes = new Map();
    for (let servant of servants) {
      if (!tribes.has(servant.tribe_id)) {
        tribes.set(servant.tribe_id, []);
      }
      (tribes.get(servant.tribe_id)).push(servant);
    }

    for (let tribeId of tribes.keys()) {
      yield createSpriteWithTribe(tribeId, tribes.get(tribeId));
    }
  });
};

function findServants(args) {
  return models.servant.find(args).sort({_id: 1}).exec();
}

function createSpriteWithTribe(tribeId, servants) {
  return new Promise(function(resolve, reject) {
    let max = 0;
    for (let servant of servants) {
      max = Math.max(servant.tribe_code, max);
    }
    lwip.create(150 * max, 890 / 640 * 150, {r: 0, g: 0, b: 0}, function(err, image) {
      co(function *() {
        image = image.batch();
        for (let servant of servants) {
          image = yield paste(image, servant);
        }
        return image;
      }).then(function(image) {
        image.writeFile(`${imageDir}m/spr-${tribeId}.jpg`, 'jpg', function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }, function(err) {
        reject(err);
      });
    });
  });
}

function paste(image, servant) {
  return new Promise(function(resolve, reject) {
    let imagePath = `${imageDir}m/${servant.id}.jpg`;
    lwip.open(imagePath, function(err, pasteImage) {
      if (err) {
        reject(err);
        return;
      }
      image.paste(150 * (servant.tribe_code - 1), 0, pasteImage);
      resolve(image);
    });
  });
}
