'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ServantSchema = new Schema({
  _id:              { type: Number, require: true, unique: true },
  tribe_id:          { type: Number, require: true },
  tribe_name:        { type: String, require: true },
  tribe_code:        { type: Number, require: true },
  type:             String,
  name:             String,
  cost:             Number,
  range:            Number,
  date:             Date,
  illustration_by:  String,
  character_voice:  String,
  oral_tradition:   String,
  skill: {
    active: {
      name:         String,
      designation:  String,
      effect:       String,
      description:  String,
      ap:           [Number],
      cd:           [Number]
    },
    passive: {
      name:         String,
      designation:  String,
      effect:       String,
      description:  String,
      ap:           [Number],
      cd:           [Number]
    }
  },
  status: {
    1: {
      hp:           Number,
      ap:           Number,
      atk:          Number,
      pow:          Number,
      def:          Number,
      res:          Number,
      ms:           Number,
      as:           Number
    },
    20: {
      hp:           Number,
      ap:           Number,
      atk:          Number,
      pow:          Number,
      def:          Number,
      res:          Number,
      ms:           Number,
      as:           Number
    }
  }
}, {id: false});

ServantSchema.virtual('id').get(function() {
  return this._id;
});

ServantSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('servant', ServantSchema);
