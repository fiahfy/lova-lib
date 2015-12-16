import fs from 'fs'
import mongoose from 'mongoose'
import config from '../config/mongodb'
import logger from '../utils/logger'

mongoose.connect(config.uri)

mongoose.connection.on('connected', () => {
  logger.info(`Mongoose default connection open to ${config.uri}`)
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
export {default as servantranking} from './servantranking'
export {default as spellranking} from './spellranking'
