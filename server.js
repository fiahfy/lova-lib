'use strict';

var config = require('./src/server/config/app');
var koa = require('koa');
var app = koa();

config.route(app);

app.listen(config.port, config.ip);
