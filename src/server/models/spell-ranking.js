import mongoose from 'mongoose'

const Schema = mongoose.Schema

const SpellRankingShema = new Schema({
  _id:      {type: Number, require: true, unique: true},
  date:     {type: Date,   require: true},
  map:      {type: String, require: true},
  queue:    {type: String, require: true},
  spell_id: {type: Number, require: true},
  seq:      {type: Number, require: true},
  rank:     {type: Number, require: true},
  score:    {type: Number, require: true}
}, {id: false})

SpellRankingShema.virtual('id').get(function() {
  return this._id
})

SpellRankingShema.set('toJSON', {
  virtuals: true
})

export default mongoose.model('spellRanking', SpellRankingShema)
