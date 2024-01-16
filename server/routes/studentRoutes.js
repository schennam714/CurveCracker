const express = require('express');
const router = express.Router();
const Class = require('../models/classModel');
const Student = require('../models/studentModel');
const calculateDistribution = require('../utility/gradeDistribution');
router.post('/submitScore', async (req, res) => {
    try {
        const { studentId, classId, score } = req.body;
        const classData = await Class.findOneAndUpdate(
            { "_id": classId, "students.studentId": studentId },
            { "$set": { "students.$.score": score } },
            { new: true }
        );

        if (!classData) {
            return res.status(404).send('Class not found or student not in class');
        }

        res.status(200).send('Score submitted successfully');
    } catch (error) {
        res.status(500).send('Error submitting score: ' + error.message);
    }
});

router.get('/viewScores/:classId', async (req, res) => {
    try {
        const { classId } = req.params;
        const classData = await Class.findById(classId);

        if (!classData || classData.students.length === 0) {
            return res.status(404).send('No students found for this class');
        }

        const scoreData = classData.students
                            .filter(s => s.score != null)
                            .map(s => ({
                                studentId: s.studentId,
                                score: s.score
                            }));

        res.status(200).json(scoreData);
    } catch (error) {
        res.status(500).send('Error retrieving scores: ' + error.message);
    }
});

const allowedUpdateFields = ['password'];  

router.put('/update', async (req, res) => {
  try {
    const { studentId, updatedData } = req.body;

    const updateKeys = Object.keys(updatedData);
    console.log(updateKeys);
    const isValidUpdate = updateKeys.every(key => allowedUpdateFields.includes(key));

    if (!isValidUpdate) {
      return res.status(400).send('Invalid update fields');
    }

    const student = await Student.findOneAndUpdate({ studentId }, updatedData, { new: true, runValidators: true });

    if (!student) {
      return res.status(404).send('Student not found');
    }
    
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send('Error updating student: ' + error.message);
  }
});

router.get('/distribution/:classId/:studentId', async (req, res) => {
    try {
        const { classId, studentId } = req.params;
        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).send('Class not found');
        }

        const scores = classData.students
                        .filter(s => s.score != null)
                        .map(s => s.score);
        const distribution = calculateDistribution(scores);

        const studentEntry = classData.students.find(s => s.studentId === studentId);
        if (!studentEntry) {
            return res.status(404).send('Student not found in class');
        }

        const studentRank = distribution.find(d => d.score === studentEntry.score);
        res.status(200).json(studentRank);
    } catch (error) {
        res.status(500).send('Error calculating distribution: ' + error.message);
    }
});
module.exports = router;
  