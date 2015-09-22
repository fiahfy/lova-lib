'use strict';

var route = require('koa-route');
var koa = require('koa');
var app = koa();

var config = {
  port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
};

app.use(route.get('/', root));
app.use(route.get('/servants', servants));
app.use(route.get('/servants/:id', servant));

function *root() {
  this.body = 'root';
}

function *servants() {
  this.body = 'servants';
}

function *servant(id) {
  this.body = `servant ${id}`;
}

app.listen(config.port, config.ip);
