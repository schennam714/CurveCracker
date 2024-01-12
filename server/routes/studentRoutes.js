const express = require('express');
const router = express.Router();
const Class = require('../models/classModel');
const Student = require('../models/studentModel');
router.post('/submitScore', async (req, res) => {
    try {
      const { studentId, classId, score } = req.body;
      const student = await Student.findOne({ studentId: studentId });

      if (!student) {
        return res.status(404).send('Student not found');
      }
  
      const classIndex = student.classes.findIndex(c => c.classId.equals(classId));
      if (classIndex >= 0) {
        // Update existing score
        student.classes[classIndex].score = score;
      } else {
        // Add new class and score
        student.classes.push({ classId, score });
      }
  
      await student.save();
      res.status(200).send('Score submitted successfully');
    } catch (error) {
      res.status(500).send('Error submitting score: ' + error.message);
    }
});

router.get('/viewScores/:classId', async (req, res) => {
    try {
      const { classId } = req.params;
      const students = await Student.find({'classes.classId': classId}, 'studentId classes.$');
  
      if (students.length === 0) {
        return res.status(404).send('No students found for this class');
      }
  
      const scoreData = students.map(student => {
        return {
          studentId: student.studentId,
          score: student.classes[0].score  // Assuming classes.$ returns the matched class
        };
      });
  
      res.status(200).send(scoreData);
    } catch (error) {
      res.status(500).send('Error retrieving scores: ' + error.message);
    }
});

const allowedUpdateFields = ['password'];  // Add more fields as per your requirements

// PUT request to update student profile
router.put('/update', async (req, res) => {
  try {
    const { studentId, updatedData } = req.body;

    // Validate updatedData
    const updateKeys = Object.keys(updatedData);
    console.log(updateKeys);
    const isValidUpdate = updateKeys.every(key => allowedUpdateFields.includes(key));

    if (!isValidUpdate) {
      return res.status(400).send('Invalid update fields');
    }

    // Add more validations as per your schema if needed

    const student = await Student.findOneAndUpdate({ studentId }, updatedData, { new: true, runValidators: true });

    if (!student) {
      return res.status(404).send('Student not found');
    }
    
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send('Error updating student: ' + error.message);
  }
});
module.exports = router;
  