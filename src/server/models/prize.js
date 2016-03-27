import mongoose from 'mongoose'

const Schema = mongoose.Schema

const PrizeSchema = new Schema({
  _id:  {type: Number, require: true, unique: true},
  name: {type: String, require: true},
  rate: {type: Number, require: true},
  date: {type: Date,   require: true}
}, {id: false})

PrizeSchema.virtual('id').get(function() {
  return this._id
})

PrizeSchema.set('toJSON', {
  virtuals: true
})

PrizeSchema.set('toObject', {
  virtuals: true
})

export default mongoose.model('prize', PrizeSchema)
