const mongoose = require("mongoose");
const minted = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  price: String,
  creator: String,
  trxHash: String,
  contractAddress: String,
  blockHash: String
});

module.exports = mongoose.model("Mints", minted);
