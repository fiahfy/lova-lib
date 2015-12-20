import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CounterSchema = new Schema({
  _id: String,
  seq: Number
})

CounterSchema.statics.getNewId = function(name, callback) {
  return new Promise((resolve, reject) => {
    this.collection.findAndModify(
      {_id: name},
      [],
      {$inc: {seq: 1}},
      {new: true, upsert: true},
      (err, result) => {
        if (callback) {
          callback(err, result)
        }
        if (err) {
          reject({err: err, result: result})
          return
        }
        resolve({err: err, result: result})
      }
    )
  })
}

export default mongoose.model('counter', CounterSchema)
