const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  result: String,
  time: Number,
}); 

module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);
