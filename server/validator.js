const mongoose = require("mongoose");
const validator = new mongoose.Schema({
  address: String,
  code: Number,
  validUntil: Date,
});

module.exports = mongoose.model("Validator", validator);
