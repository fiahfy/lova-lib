import moment from 'moment'
import xmlify from 'xmlify'
import config from '../../config'
import * as models from '../models'

export default async function (ctx) {
  const servants = await models.servant.find({}, 'id update_date').sort({_id: 1}).exec()

  let pathes = []
  pathes.push({path: '/'})
  pathes.push({path: '/about/'})
  pathes.push({path: '/charts/'})
  pathes.push({path: '/deck/'})
  pathes.push({path: '/prize/'})
  servants.forEach(servant => {
    pathes.push({path: `/servants/${servant.id}/`, update_date: servant.update_date})
  })

  const urls = pathes.map(({path, update_date}) => {
    let url = {loc: `http://${config.app.dns}${path}`}
    if (!update_date) {
      return url
    }
    url.lastmod = moment(update_date).toISOString()
    return url
  })

  const urlset = {
    _xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    url: urls
  }

  ctx.type = 'xml'
  ctx.body = xmlify(urlset, 'urlset')
}
