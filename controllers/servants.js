'use strict';

var models = require('../models');
var Q = require('q');

function *servants() {
  this.body = (yield getServants()).rows;
}

function getServants() {
  var d = Q.defer();
  models.servant.find({}, function(err, rows) {
    var reason = {err: err, rows: rows};
    if (err) {
      d.reject(reason);
      return;
    }
    d.resolve(reason);
  });
  return d.promise;
}

module.exports = servants;
