'use strict';

var controllers = require('../controllers');
var route = require('koa-route');

module.exports = function(app) {
  app.use(route.get('/', controllers.root));
  app.use(route.get('/servants', controllers.servants));
  app.use(route.get('/servants/:id', controllers.servant));
};
