const express = require('express');
const router = express.Router();
const Class = require('../models/classModel');
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
  
      if (foundClass.students.includes(studentId)) {
        return res.status(400).send('Student already enrolled in this class');
      }
  
      foundClass.students.push({ studentId, score: null });
      await foundClass.save();
      res.status(200).send('Joined class successfully');
    } catch (error) {
      res.status(500).send('Error joining class: ' + error.message);
    }
  });
  
  module.exports = router;