'use strict';

var fs = require('fs');

fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    module.exports[moduleName] = require('./' + moduleName);
  }
});
