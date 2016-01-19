import 'babel-polyfill'
import koa from 'koa'
import koaStatic from 'koa-static'
import routes from './server/routes'
import config from './config'

const app = koa()

app.use(koaStatic('public'))
app.use(routes)
app.listen(config.app.port)
