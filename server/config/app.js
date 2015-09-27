'use strict';

var controllers = require('../controllers');
var route = require('koa-route');
var st = require('koa-static');
var send = require('koa-send');

var config = {
  port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip:   process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
};

config.route = function(app) {
  app.use(function *(next) {
    if (this.path.indexOf('/api/') === 0) {
      // server
      yield next;
    } else if (this.path.indexOf('.') > -1) {
      // static file
      yield next;
    } else {
      // client
      yield send(this, '/index.html', {root: 'client'});
    }
  });
  app.use(st('client', {maxage: 10 * 60 * 1000}));
  app.use(route.get('/api/', controllers.root));
  app.use(route.get('/api/servants/', controllers.servants));
  app.use(route.get('/api/servants/:id/', controllers.servant));
  app.use(route.get('/api/prizes/', controllers.prizes));
};

module.exports = config;
