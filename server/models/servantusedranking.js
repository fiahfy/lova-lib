'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ServantusedrankingShema = new Schema({
  _id:              { type: Number, require: true, unique: true },
  date:             { type: Date,   require: true },
  servant_id:       { type: Number, require: true },
  seq:              { type: Number, require: true },
  rank:             { type: Number, require: true },
  rate:             { type: Number, require: true }
}, {id: false});

ServantusedrankingShema.virtual('id').get(function() {
  return this._id;
});

ServantusedrankingShema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('servantusedranking', ServantusedrankingShema);
