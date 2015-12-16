import url from 'url'

const config = {
  host: process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
  port: process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
  user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
  pass: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
  protocol: 'mongodb',
  db: 'lova'
}

const {host, port, user, pass, protocol, db} = config
config.uri = url.format({
  protocol: `${protocol}:`,
  slashes:  true,
  auth:     user && pass ? `${user}:${pass}` : null,
  hostname: host,
  port:     port,
  pathname: `/${db}`
})

export default config
