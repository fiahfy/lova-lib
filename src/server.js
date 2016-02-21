import 'babel-polyfill'
if (config.newrelic.license_key) {
  require('newrelic');
}
import koa from 'koa'
import koaStatic from 'koa-static'
import koaTimeout from 'koa-timeout'
import routes from './server/routes'
import config from './config'

const app = koa()

app.use(koaTimeout(10000))
app.use(koaStatic('public'))
app.use(routes)
app.listen(config.app.port)
