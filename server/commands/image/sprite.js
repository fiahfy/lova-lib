'use strict';

var co = require('co');
var fs = require('fs');
var request = require('request');
var lwip = require('lwip');
var scraper = require('../../utils/scrapers');
var models = require('../../models');

const imageDir = './client/assets/img/';

module.exports = function(id) {
  return co(function *() {
    var servants = yield findServants({});

    yield createSprite(servants);
  });
};

function findServants(args) {
  return models.servant.find(args).sort({_id: 1}).exec();
}

function createSprite(servants) {
  return new Promise(function(resolve, reject) {
    lwip.create(150 * servants.length, 890 / 640 * 150, {r: 0, g: 0, b: 0, a: 0}, function(err, image) {
      co(function *() {
        image = image.batch();
        for (var i = 0; i < servants.length; i++) {
          image = yield paste(image, i);
        }
        return image
      }).then(function(image) {
        image.writeFile(`${imageDir}m/sprite.jpg`, 'jpg', function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        })
      }, function(err) {
        reject(err);
      });
    });
  });
}

function paste(image, i) {
  return new Promise(function(resolve, reject) {
    var imagePath = `${imageDir}m/${i + 1}.jpg`;
    lwip.open(imagePath, function(err, pasteImage) {
      if (err) {
        reject(err);
        return;
      }
      image.paste(150 * i, 0, pasteImage);
      resolve(image);
    });
  });
}
