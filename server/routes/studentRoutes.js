const express = require('express');
const router = express.Router();
const Class = require('../models/classModel');
const Student = require('../models/studentModel');
const calculateDistribution = require('../utility/gradeDistribution');
const { encrypt, decrypt } = require('../utility/security');
router.post('/submitScore', async (req, res) => {
    try {
        const { studentId, classIdentifier, score } = req.body;
        const encryptedScore = encrypt(score.toString());
        const classData = await Class.findOneAndUpdate(
            { "identifier": classIdentifier, "students.studentId": studentId },
            { "$set": { "students.$.score": encryptedScore } },
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

router.get('/viewScores/:classIdentifier', async (req, res) => {
    try {
        const { classIdentifier } = req.params;
        const classData = await Class.findOne({ identifier: classIdentifier });

        if (!classData || classData.students.length === 0) {
            return res.status(404).send('No students found for this class');
        }

        const scoreData = classData.students
                            .filter(s => s.score != null)
                            .map(s => {
                                try {
                                    const decryptedScore = decrypt(s.score);
                                    return {
                                        studentId: s.studentId,
                                        score: Number(decryptedScore)
                                    };
                                } catch (error) {
                                    console.error('Decryption error:', error);
                                    return null; 
                                }
                            })
                            .filter(s => s != null);
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

router.get('/distribution/:classIdentifier/:studentId', async (req, res) => {
    try {
        const { classIdentifier, studentId } = req.params;
        const classData = await Class.findOne({ identifier: classIdentifier });

        if (!classData) {
            return res.status(404).send('Class not found');
        }

        const scores = classData.students
                        .filter(s => s.score != null)
                        .map(s => Number(decrypt(s.score)));
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
router.get('/classes/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findOne({ studentId }).populate('classes.classId');

        if (!student) {
            return res.status(404).send('Student not found');
        }

        const classList = student.classes.map(item => {
            return {
                classId: item.classId._id,
                className: item.classId.name,
                identifier: item.classId.identifier
            };
        });

        res.json(classList);
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
    }
});

router.post('/leave', async (req, res) => {
    try {
        const { studentId, classIdentifier } = req.body;

        const foundClass = await Class.findOne({ identifier: classIdentifier });
        if (!foundClass) {
            return res.status(404).send('Class not found');
        }
        foundClass.students = foundClass.students.filter(student => student.studentId !== studentId);
        await foundClass.save();
        const student = await Student.findOne({ studentId: studentId });
        if (student) {
            student.classes = student.classes.filter(classItem => classItem.classId.toString() !== foundClass._id.toString());
            await student.save();
        }
        res.status(200).send('Left class successfully');
    } catch (error) {
        res.status(500).send('Error leaving class: ' + error.message);
    }
});
module.exports = router;
  