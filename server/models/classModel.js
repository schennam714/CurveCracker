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
  students: [String]
});

module.exports = mongoose.model('Class', ClassSchema);