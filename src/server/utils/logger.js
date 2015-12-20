import winston from 'winston'

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({level: 'silly', timestamp: true})
  ]
})
logger.cli()

export default logger
