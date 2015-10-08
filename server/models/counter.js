'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CounterSchema = new Schema({
  _id: String,
  seq: Number
});

CounterSchema.statics.getNewId = function (name,  callback) {
  let me = this;
  return new Promise(function(resolve, reject) {
    me.collection.findAndModify(
      { _id: name },
      [],
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
      function(err, result) {
        if (callback) {
          callback(err, result);
        }
        if (err) {
          reject({err: err, result: result});
          return;
        }
        resolve({err: err, result: result});
      }
    );
  });
};

module.exports = mongoose.model('counter', CounterSchema);
