'use strict';

var models = require('../models');
var Q = require('q');

function *servant(id) {
  this.body = (yield getServant(id)).row;
}

function getServant(id) {
  var d = Q.defer();
  models.servant.findOne({_id: id}, function(err, row) {
    var reason = {err: err, row: row};
    if (err) {
      d.reject(reason);
      return;
    }
    d.resolve(reason);
  });
  return d.promise;
}

module.exports = servant;
