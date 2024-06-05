const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  result: String,
}); 

module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);