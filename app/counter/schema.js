const mongo = require('../../server/mongodb');
const mongoose = require('mongoose');

module.exports = mongo.model('Counter', new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 9999
  }
}));