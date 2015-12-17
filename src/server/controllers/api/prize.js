import * as models from '../../models'

export default (function *() {
  this.body = yield models.prize.find({}).exec()
})
