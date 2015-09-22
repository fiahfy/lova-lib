'use strict';

var koa = require('koa');
var app = koa();

var config = {
  port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
};

app.use(function * () {
  this.body = 'OK';
});

app.listen(config.port, config.ip);
