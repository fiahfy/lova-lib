import url from 'url'
import mongoose from 'mongoose'
import logger from '../utils/logger'

const config = {
  host: process.env.DOCKER_MONGO_HOST || '127.0.0.1',
  port: process.env.DOCKER_MONGO_PORT || 27017,
  user: process.env.DOCKER_MONGO_USERNAME,
  pass: process.env.DOCKER_MONGO_PASSWORD,
  protocol: 'mongodb',
  db: 'lova'
}

const {host, port, user, pass, protocol, db} = config
const uri = url.format({
  protocol: `${protocol}:`,
  slashes:  true,
  auth:     user && pass ? `${user}:${pass}` : null,
  hostname: host,
  port:     port,
  pathname: `/${db}`
})

mongoose.connect(uri)

mongoose.connection.on('connected', () => {
  logger.info(`Mongoose default connection open to ${uri}`)
})

mongoose.connection.on('error', err => {
  logger.error(`Mongoose default connection error: ${err}`)
})

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected')
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

export {default as counter} from './counter'
export {default as servant} from './servant'
export {default as prize} from './prize'
export {default as servantRanking} from './servant-ranking'
export {default as spellRanking} from './spell-ranking'
