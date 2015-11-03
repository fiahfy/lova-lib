'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ServantrankingShema = new Schema({
  _id:              { type: Number, require: true, unique: true },
  date:             { type: Date,   require: true },
  mode:             { type: String, require: true },
  map:              { type: String, require: true },
  queue:            { type: String, require: true },
  servant_id:       { type: Number, require: true },
  seq:              { type: Number, require: true },
  rank:             { type: Number, require: true },
  score:            { type: Number, require: true }
}, {id: false});

ServantrankingShema.virtual('id').get(function() {
  return this._id;
});

ServantrankingShema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('servantranking', ServantrankingShema);
