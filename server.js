var koa = require('koa');
var app = koa();

app.use(function * () {
  this.body = 'OK';
});

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 3000);
