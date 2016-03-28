import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CombinationSchema = new Schema({
  _id:         {type: Number,   require: true, unique: true},
  servant_ids: {type: [Number], require: true}
}, {id: false})

CombinationSchema.virtual('id').get(function() {
  return this._id
})

CombinationSchema.set('toJSON', {
  virtuals: true
})

CombinationSchema.set('toObject', {
  virtuals: true
})

export default mongoose.model('combination', CombinationSchema)
