import co from 'co'
import fs from'fs'
import logger from '../../utils/logger'
import * as scraper from '../../utils/scraper'
import * as models from '../../models'
import lwip from 'lwip'
import request from 'request'

const imageDir = './public/assets/storage/img/'

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
    logger.verbose('Clip Image URL: %s', clipUrl)
    logger.verbose('Image URL: %s', url)
    if (!clipUrl || !url) {
      throw new Error('Image Url is Not Found')
    }

    yield download(clipUrl, clipImagePath)
    yield download(url, largeImagePath)

    // resize clip
    yield resize(clipImagePath, clipImagePath, 40, 40)
    // create middle image
    yield scale(largeImagePath, middleImagePath, 150 / 640)

    // yield compress(middleImagePath, middleImagePath, {quality: 50})
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
    if (servant.name === 'カイ=キスク') {
      servant.tribe_code = 51
    }
    const tribeNameAndCode = `${servant.tribe_name}-${_.padLeft(servant.tribe_code, 3, 0)}`
    return $('#content_1001_1').next().next()
      .find(`table tbody tr td:contains(${tribeNameAndCode})`).last().prev().prev()
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
      .pipe(fs.createWriteStream(path).on('close', () => {
        resolve()
      }))
  })
}

function resize(orgPath, distPath, width, height) {
  return new Promise((resolve, reject) => {
    lwip.open(orgPath, (err, image) => {
      image.batch().resize(width, height, 'lanczos').writeFile(distPath, 'jpg', {}, err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })
}

function scale(orgPath, distPath, ratio) {
  return new Promise((resolve, reject) => {
    lwip.open(orgPath, (err, image) => {
      image.batch().scale(ratio, ratio, 'lanczos').writeFile(distPath, 'jpg', {}, err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })
}

// function compress(orgPath, distPath, params) {
//   return new Promise((resolve, reject) => {
//     lwip.open(orgPath, (err, image) => {
//       image.toBuffer('jpg', params, (err, buffer) => {
//         lwip.open(buffer, 'jpg', function(err, image) {
//           image.writeFile(distPath, 'jpg', {}, function (err) {
//             if (err) {
//               reject(err)
//               return
//             }
//             resolve()
//           })
//         })
//       })
//     })
//   })
// }
