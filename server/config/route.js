'use strict';

var controllers = require('../controllers');
var route = require('koa-route');
var send = require('koa-send');

module.exports = function(app) {
  app.use(function *(next) {
    var sendOpts = {root: 'client'};
    if (this.path.substr(0, 5).toLowerCase() === '/api/') {
      // server
      yield next;
    } else if (yield send(this, this.path, sendOpts)) {
      // static file
    } else if (this.path.indexOf('.') !== -1) {
      // not found
    } else {
      // client
      yield send(this, '/index.html', sendOpts);
    }
  });
  app.use(route.get('/api', controllers.root));
  app.use(route.get('/api/servants', controllers.servants));
  app.use(route.get('/api/servants/:id', controllers.servant));
};
