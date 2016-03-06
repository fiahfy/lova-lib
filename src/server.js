import 'babel-polyfill'
import Koa from 'koa'
import koaConvert from 'koa-convert'
import koaStatic from 'koa-static'
import koaTimeout from 'koa-timeout'
import config from './config'
if (config.newrelic.license_key) {
  require('newrelic')
}
import routes from './server/routes'

const app = new Koa()

app.use(koaConvert(koaTimeout(10000)))
app.use(koaConvert(koaStatic('public')))
app.use(routes)
app.listen(config.app.port, () => {
  console.log(`Server started: http://localhost:${config.app.port}/`) // eslint-disable-line no-console
})
