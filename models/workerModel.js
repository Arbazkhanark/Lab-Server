const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  complaints:[{type:String}]
});

const workerModel = mongoose.model('Worker', workerSchema);

module.exports = workerModel;
