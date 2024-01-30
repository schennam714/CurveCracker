const mongoose = require('mongoose');
const EncryptedScoreSchema = require('./encryptedScoreSchema');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  students: [{
    studentId: String,
    score: EncryptedScoreSchema
  }]
});

module.exports = mongoose.model('Class', ClassSchema);