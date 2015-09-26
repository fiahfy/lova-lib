'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PrizeSchema = new Schema({
  _id:  { type: Number, require: true, unique: true },
  name: { type: String, require: true, unique: true },
  rate: { type: Number, require: true },
  date: { type: Date,   require: true }
}, {id: false});

PrizeSchema.virtual('id').get(function() {
  return this._id;
});

PrizeSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('prize', PrizeSchema);
