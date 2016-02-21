import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'

export default {
  env:    process.env.NODE_ENV || 'development',
  target: ExecutionEnvironment.canUseDOM ? 'client' : 'server',
  devtools: {
    monitor: false
  },
  newrelic: {
    license_key: process.env.DOCKER_NEW_RELIC_LICENSE_KEY
  },
  app: {
    dns:  process.env.DOCKER_NODE_DNS || 'localhost:3000',
    port: process.env.DOCKER_NODE_PORT || 3000
  },
  mongo: {
    host: process.env.DOCKER_MONGO_HOST || '127.0.0.1',
    port: process.env.DOCKER_MONGO_PORT || 27017,
    user: process.env.DOCKER_MONGO_USERNAME,
    pass: process.env.DOCKER_MONGO_PASSWORD,
    protocol: 'mongodb',
    db:   'lova'
  }
}
