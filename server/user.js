const mongoose = require("mongoose");


const MINT = new mongoose.Schema({
  chain:String,
  contractAddress: String,
  description: String,
  mintToAddress: String,
  name: String,
  transactionExternalURL: String,
  transactionHash: String,
  download: String,
})


const user = new mongoose.Schema({
  username: String,
  address: String,
  email: String,
  profilePic: String,
  profileBanner: String,
  bio: String,
  joinDate: Date,
  isVerified: Boolean,
  mints: [MINT]
});
module.exports = mongoose.model("User", user);