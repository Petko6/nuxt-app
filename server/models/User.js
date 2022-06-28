const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  steam: { type: String, unique: true },
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
