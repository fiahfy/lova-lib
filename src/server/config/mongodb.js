'use strict';

let config = {
  host:   process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
  port:   process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
  user:   process.env.OPENSHIFT_MONGODB_DB_USERNAME,
  pass:   process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
  scheme: 'mongodb',
  db:     'lova'
};

config.uri = (function(config) {
  let uri = '';
  if (config.user) {
    uri += config.user;
    if (config.pass) {
      uri += `:${config.pass}`;
    }
    uri += '@';
  }
  uri += config.host;
  if (config.port) {
    uri += `:${config.port}`;
  }
  return `${config.scheme}://${uri}/${config.db}`;
})(config);

module.exports = config;
