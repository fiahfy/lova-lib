'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let SpellrankingShema = new Schema({
  _id:              { type: Number, require: true, unique: true },
  date:             { type: Date,   require: true },
  spell_id:         { type: Number, require: true },
  seq:              { type: Number, require: true },
  rank:             { type: Number, require: true },
  score:            { type: Number, require: true }
}, {id: false});

SpellrankingShema.virtual('id').get(function() {
  return this._id;
});

SpellrankingShema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('spellranking', SpellrankingShema);
