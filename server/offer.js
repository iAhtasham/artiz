const mongoose = require("mongoose");
const offer = new mongoose.Schema({
  offerPrice: Number,
  nft: Number,
  offerTime: Date,
  offeredBy: String,
  status: String,
});
module.exports = mongoose.model("Offer", offer);
