import 'babel-polyfill'
import config from './server/config/app'
import koa from 'koa'

const app = koa()

config.route(app)

app.listen(config.port, config.ip)
