const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/@utexas.edu$/, 'Please use a UT Austin email']
  },
  classes: [{
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    },
    score: Number
  }]
});

module.exports = mongoose.model('Student', StudentSchema);