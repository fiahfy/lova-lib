'use strict';

var config = require('./server/config/app');
var koa = require('koa');
var app = koa();

config.route(app);

app.listen(config.port, config.ip);
