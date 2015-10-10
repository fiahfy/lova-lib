'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ServantWinRankingSchema = new Schema({
  _id:              { type: Number, require: true, unique: true },
  date:             { type: Date,   require: true },
  servant_id:       { type: Number, require: true },
  seq:              { type: Number, require: true },
  rank:             { type: Number, require: true },
  rate:             { type: Number, require: true }
}, {id: false});

module.exports = mongoose.model('servantWinRanking', ServantWinRankingSchema);
