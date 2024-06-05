const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  result: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}); 

module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);
