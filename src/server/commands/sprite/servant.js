import co from 'co'
import logger from '../../utils/logger'
import * as models from '../../models'
let lwip = null
if (!process.env.OPENSHIFT_APP_DNS) {
  lwip = require('lwip')
}

const imageDir = './public/assets/img/'

export default function() {
  return co(function *() {
    let servants = yield findServants({})

    let tribes = new Map()
    for (let servant of servants) {
      if (!tribes.has(servant.tribe_id)) {
        tribes.set(servant.tribe_id, [])
      }
      (tribes.get(servant.tribe_id)).push(servant)
    }

    for (let tribeId of tribes.keys()) {
      logger.verbose('Create Servant Clip Sprite Image: tribe_id = %d', tribeId)
      yield createClipSpriteWithTribe(tribeId, tribes.get(tribeId))
      logger.verbose('Create Servant Sprite Image: tribe_id = %d', tribeId)
      yield createSpriteWithTribe(tribeId, tribes.get(tribeId))
    }
  })
}

function findServants(args) {
  return models.servant.find(args).sort({_id: 1}).exec()
}

function createClipSpriteWithTribe(tribeId, servants) {
  return new Promise((resolve, reject) => {
    const max = servants.reduce((previous, current) => {
      return Math.max(current.tribe_code, previous)
    }, 0)
    lwip.create(40 * max, 40, {r: 0, g: 0, b: 0}, (err, image) => {
      co(function *() {
        image = image.batch()
        for (let servant of servants) {
          image = yield pasteSprite(image, servant)
        }
        return image
      }).then(image => {
        image.writeFile(`${imageDir}clip/spr-${tribeId}.jpg`, 'jpg', err => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      }, err => {
        reject(err)
      })
    })
  })
}

function createSpriteWithTribe(tribeId, servants) {
  return new Promise((resolve, reject) => {
    const max = servants.reduce((previous, current) => {
      return Math.max(current.tribe_code, previous)
    }, 0)
    lwip.create(150 * max, 890 / 640 * 150, {r: 0, g: 0, b: 0}, (err, image) => {
      co(function *() {
        image = image.batch()
        for (let servant of servants) {
          image = yield paste(image, servant)
        }
        return image
      }).then(image => {
        image.writeFile(`${imageDir}m/spr-${tribeId}.jpg`, 'jpg', err => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      }, err => {
        reject(err)
      })
    })
  })
}

function pasteSprite(image, servant) {
  return new Promise((resolve, reject) => {
    const imagePath = `${imageDir}clip/${servant.id}.jpg`
    lwip.open(imagePath, (err, pasteImage) => {
      if (err) {
        reject(err)
        return
      }
      image.paste(40 * (servant.tribe_code - 1), 0, pasteImage)
      resolve(image)
    })
  })
}

function paste(image, servant) {
  return new Promise((resolve, reject) => {
    const imagePath = `${imageDir}m/${servant.id}.jpg`
    lwip.open(imagePath, (err, pasteImage) => {
      if (err) {
        reject(err)
        return
      }
      image.paste(150 * (servant.tribe_code - 1), 0, pasteImage)
      resolve(image)
    })
  })
}
