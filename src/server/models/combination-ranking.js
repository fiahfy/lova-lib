import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CombinationRankingShema = new Schema({
  _id:            {type: Number, require: true, unique: true},
  date:           {type: Date,   require: true},
  mode:           {type: String, require: true},
  combination_id: {type: Number, require: true},
  seq:            {type: Number},
  rank:           {type: Number},
  score:          {type: Number},
  count:          {type: Number}
}, {id: false, collection: 'combinationRankings'})

CombinationRankingShema.virtual('id').get(function() {
  return this._id
})

CombinationRankingShema.set('toJSON', {
  virtuals: true
})

CombinationRankingShema.set('toObject', {
  virtuals: true
})

export default mongoose.model('combinationRanking', CombinationRankingShema)
