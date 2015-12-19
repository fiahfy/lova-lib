import 'babel-polyfill'
import koa from 'koa'
import koaStatic from 'koa-static'
import koaSend from 'koa-send'
import crypto from 'crypto'
import LRU from 'lru-cache'
import routes from './server/routes'

const config = {
  port: process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip:   process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
}

const cache = LRU({maxAge: 1000 * 60})

const app = koa()

app.use(koaStatic('public', {maxage: 10 * 60 * 1000}))
if (!config.development) {
  app.use(function *(next) {
    if (this.path.indexOf('.') > -1) {
      yield next
    } else {
      let key = crypto.createHash('md5').update(this.url).digest('hex')
      let value = cache.get(key)
      if (value) {
        this.body = value
        return
      }
      yield next
      cache.set(key, this.body)
    }
  })
}
app.use(routes)

app.listen(config.port, config.ip)
