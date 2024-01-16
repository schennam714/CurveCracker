const mongoose = require('mongoose');

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
    score: Number
  }]
});

module.exports = mongoose.model('Class', ClassSchema);