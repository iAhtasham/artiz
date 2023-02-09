const mongoose = require("mongoose");
const nft = new mongoose.Schema({
  contract: String,
  token: String,
  name: String,
  image: String,
  description: String,
  updatedDate: Date,
  owner: String,
  fileSize: Number,
  height: Number,
  width: Number,
  animationURL: String,
});

module.exports = mongoose.model("NFT", nft);
