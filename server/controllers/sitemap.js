'use strict';

let xmlify = require('xmlify');
let models = require('../models');

function *sitemap() {
  let servants = yield models.servant.find({}, 'id').sort({_id: 1}).exec();

  let urls = [];
  urls.push('/');
  urls.push('/deck/');
  urls.push('/ranking/');
  urls.push('/prize/');
  urls.push('/about/');
  for (let servant of servants) {
    urls.push(`/servants/${servant.id}/`);
  }

  urls = urls.map((loc) => {
    return {loc: `http://lova-fiahfy.rhcloud.com${loc}`};
  });

  let urlset = {
    _xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    url: urls
  };

  this.type = 'xml';
  this.body = xmlify(urlset, 'urlset');
}

module.exports = sitemap;
