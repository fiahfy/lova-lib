import co from 'co'
import fs from'fs'
import request from'request'
// if (process.env.NODE_ENV !== 'production') {
import lwip from 'lwip'
// }
import logger from '../../utils/logger'
import * as scraper from '../../utils/scraper'
import * as models from '../../models'

const imageDir = './public/assets/img/'

export default function(id, force) {
  return co(function *() {
    let servants
    if (id) {
      servants = yield findServants({_id: id})
    } else {
      servants = yield findServants({})
    }
    for (let servant of servants) {
      yield save(servant, force)
    }
  })
}

function findServants(args) {
  return models.servant.find(args).sort({_id: 1}).exec()
}

function save(servant, force) {
  return co(function *() {
    logger.verbose('Begin Download Servant Image: id = %d', servant.id)

    const clipImagePath = `${imageDir}clip/${servant.id}.jpg`
    const largeImagePath = `${imageDir}l/${servant.id}.jpg`
    const middleImagePath = `${imageDir}m/${servant.id}.jpg`

    if (!force && (yield exists(clipImagePath)) && (yield exists(largeImagePath)) && (yield exists(middleImagePath))) {
      logger.verbose('Image File is Almost Exists')
      return
    }

    const clipUrl = yield getClipImageUrlWithServant(servant)
    const url = yield getImageUrlWithServant(servant)
    if (!clipUrl || !url) {
      throw new Error('Image Url is Not Found')
    }

    yield download(clipUrl, clipImagePath)

    yield download(url, largeImagePath)

    yield scale(largeImagePath, middleImagePath, 150 / 640)

    yield compress(middleImagePath, middleImagePath, {quality: 50})
  })
}

function getImageUrlWithServant(servant) {
  return co(function *() {
    const $ = (yield scraper.fetchServant(servant.tribe_name, servant.name)).$
    return $('#rendered-body').find('> div:first-child img').attr('src')
  })
}

function getClipImageUrlWithServant(servant) {
  return co(function *() {
    const $ = (yield scraper.fetchAllServantList()).$
    const tribeNameAndCode = `${servant.tribe_name}-${_.padLeft(servant.tribe_code, 3, 0)}`
    return $('#content_1001_1').next().next()
      .find(`table tbody tr td:contains(${tribeNameAndCode})`).prev().prev()
      .find('a img').attr('src')
  })
}

function exists(path) {
  return new Promise(resolve => {
    fs.stat(path, err => {
      if (err == null) {
        resolve(true)
        return
      }
      resolve(false)
    })
  })
}

function download(url, path) {
  return new Promise(resolve => {
    logger.verbose('Download Image: url = %s', url)

    request
      .get(url)
      //.on('response', function(res) {
      //  console.log('statusCode: ', res.statusCode)
      //  console.log('content-length: ', res.headers['content-length'])
      //})
      .pipe(fs.createWriteStream(path).on('close', () => {
        resolve()
      }))
  })
}

function scale(orgPath, distPath, ratio) {
  return new Promise(resolve => {
    lwip.open(orgPath, (err, image) => {
      image.batch().scale(ratio, ratio, 'lanczos').writeFile(distPath, 'jpg', {}, function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })
}

function compress(orgPath, distPath, params) {
  return new Promise(resolve => {
    lwip.open(orgPath, (err, image) => {
      image.toBuffer('jpg', {quality: 50}, (err, buffer) => {
        lwip.open(buffer, 'jpg', function(err, image) {
          image.writeFile(distPath, 'jpg', {}, function (err) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          })
        })
      })
    })
  })
}
