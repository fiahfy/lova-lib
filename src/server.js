import 'babel-polyfill'
import koa from 'koa'
import koaStatic from 'koa-static'
import crypto from 'crypto'
import LRU from 'lru-cache'
import routes from './server/routes'
import config from './config'

const cache = LRU({maxAge: 1000 * 60})

const app = koa()

app.use(koaStatic('public', {maxage: 10 * 60 * 1000}))
if (config.env === 'production') {
  app.use(function *(next) {
    if (this.path.indexOf('/api/') > -1) {
      let key = crypto.createHash('md5').update(this.url).digest('hex')
      let value = cache.get(key)
      if (value) {
        this.body = value
        return
      }
      yield next
      cache.set(key, this.body)
    } else {
      yield next
    }
  })
}
app.use(routes)

app.listen(config.app.port)
