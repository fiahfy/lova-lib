'use strict';

let router = require('koa-router')();
let st = require('koa-static');
let send = require('koa-send');
let crypto = require('crypto');

let LRU = require("lru-cache");
let cache = LRU({maxAge: 1000 * 60});

let controllers = require('../controllers');

let config = {
  port:        process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip:          process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  development: process.env.OPENSHIFT_NODEJS_IP === undefined
};

config.route = function(app) {
  app.use(function *(next) {
    if (this.path.indexOf('/api/') > -1) {
      // server
      yield next;
    } else if (this.path.indexOf('.') > -1) {
      // static file
      yield next;
    } else {
      // client root
      yield send(this, '/index.html', {root: 'public'});
    }
  });
  app.use(st('public', {maxage: 10 * 60 * 1000}));
  if (!config.development) {
    app.use(function *(next){
      if (this.path.indexOf('.') > -1) {
        yield next;
      } else {
        let key = crypto.createHash('md5').update(this.url).digest('hex');
        let value = cache.get(key);
        if (value) {
          this.body = value;
          return;
        }
        yield next;
        cache.set(key, this.body);
      }
    });
  }
  router.get('/sitemap.xml', controllers.sitemap);
  router.get('/api/', controllers.root);
  router.get('/api/servants/', controllers.servants);
  router.get('/api/servants/:id/', controllers.servants);
  router.get('/api/prizes/', controllers.prizes);
  /// deprecated
  router.get('/api/ranking/servants/:mode/:year/:month/:date/', controllers.ranking.servants);
  router.get('/api/ranking/servants/:mode/latest/', controllers.ranking.servants);
  router.get('/api/ranking/servants/:id/:mode/:year/:month/:date/', controllers.ranking.servants);
  ///
  router.get('/api/servants/statistics/', controllers.servantsStatistics);
  router.get('/api/spells/statistics/', controllers.spellsStatistics);
  app.use(router.routes());
};

module.exports = config;
