import * as models from '../../models'

export default async function (ctx) {
  ctx.body = await models.prize.find({}).exec()
}
