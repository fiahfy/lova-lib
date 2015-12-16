'use strict';

// let fs = require('fs');
//
// fs.readdirSync(__dirname).forEach(function(file) {
//   if (file !== 'index.js') {
//     let fileName = file.split('.')[0];
//     let moduleName = fileName.replace(/-(\w)/, function(match, p1, offset, string) {
//       return p1.toUpperCase();
//     });
//     module.exports[moduleName] = require('./' + fileName);
//   }
// });

module.exports = {
  prizes: require('./prizes'),
  root: require('./root'),
  servantsStatistics: require('./servants-statistics'),
  servants: require('./servants'),
  sitemap: require('./sitemap'),
  spellsStatistics: require('./spells-statistics'),
  ranking: require('./ranking')
};
