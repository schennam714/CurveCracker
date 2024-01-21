const express = require('express');
const router = express.Router();
const Class = require('../models/classModel');
const Student = require('../models/studentModel');
const calculateDistribution = require('../utility/gradeDistribution');

router.post('/create', async (req, res) => {
    try {
        const { name, identifier } = req.body;
    
        const existingClass = await Class.findOne({ identifier });
        if (existingClass) {
          return res.status(400).send('Class already exists with this identifier');
        }
    
        const newClass = new Class({ name, identifier });
        await newClass.save();
        res.status(201).json(newClass);
      } catch (error) {
        res.status(500).send('Error creating class: ' + error.message);
      }
});

router.post('/join', async (req, res) => {
  try {
      const { studentId, classIdentifier } = req.body;
      const foundClass = await Class.findOne({ identifier: classIdentifier });
      if (!foundClass) {
          return res.status(404).send('Class not found');
      }
      const isAlreadyEnrolled = foundClass.students.some(student => student.studentId === studentId);
      if (isAlreadyEnrolled) {
          return res.status(400).send('Student already enrolled in this class');
      }
      const student = await Student.findOne({ studentId: studentId });
      if (!student) {
          return res.status(404).send('Student not found');
      }
      foundClass.students.push({ studentId, score: null });
      await foundClass.save();
      student.classes.push({ classId: foundClass._id, score: null });
      await student.save();
      res.status(200).send('Joined class successfully');
  } catch (error) {
      res.status(500).send('Error joining class: ' + error.message);
  }
});
  
  module.exports = router;