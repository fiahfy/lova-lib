import xmlify from 'xmlify'
import models from '../models'

export default (function *() {
  const servants = yield models.servant.find({}, 'id').sort({_id: 1}).exec()

  let pathes = []
  pathes.push('/')
  pathes.push('/about/')
  pathes.push('/charts/')
  pathes.push('/deck/')
  pathes.push('/prize/')
  servants.forEach(servants => {
    pathes.push(`/servants/${servants.id}/`)
  })

  const urls = pathes.map(path => {
    return {loc: `http://lova-fiahfy.rhcloud.com${path}`}
  })

  const urlset = {
    _xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    url: urls
  }

  this.type = 'xml'
  this.body = xmlify(urlset, 'urlset')
})
