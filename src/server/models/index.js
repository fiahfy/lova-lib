import url from 'url'
import mongoose from 'mongoose'
import config from '../../config'
import logger from '../utils/logger'

const {host, port, user, pass, protocol, db} = config.mongo
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
export {default as combination} from './combination'
export {default as servantRanking} from './servant-ranking'
export {default as spellRanking} from './spell-ranking'
export {default as combinationRanking} from './combination-ranking'
