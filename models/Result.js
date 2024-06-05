const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  finalRound: Number,
  time: Number,
}); 

module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);
