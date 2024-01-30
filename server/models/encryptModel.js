const mongoose = require('mongoose');

const EncryptedScoreSchema = new mongoose.Schema({
  iv: {
    type: String,
    required: true
  },
  encryptedData: {
    type: String,
    required: true
  }
});

module.exports = EncryptedScoreSchema;