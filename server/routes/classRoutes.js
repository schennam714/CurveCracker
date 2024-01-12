const express = require('express');
const router = express.Router();
const Class = require('../models/classModel');

// POST request to create a new class
router.post('/create', async (req, res) => {
    try {
        const { name, identifier } = req.body;
    
        // Check if class already exists
        const existingClass = await Class.findOne({ identifier });
        if (existingClass) {
          return res.status(400).send('Class already exists with this identifier');
        }
    
        const newClass = new Class({ name, identifier });
        await newClass.save();
        res.status(201).send('Class created successfully');
      } catch (error) {
        res.status(500).send('Error creating class: ' + error.message);
      }
});

// POST request for a student to join a class
router.post('/join', async (req, res) => {
    try {
      const { studentId, classIdentifier } = req.body;
  
      const foundClass = await Class.findOne({ identifier: classIdentifier });
      if (!foundClass) {
        return res.status(404).send('Class not found');
      }
  
      // Check if student already enrolled
      if (foundClass.students.includes(studentId)) {
        return res.status(400).send('Student already enrolled in this class');
      }
  
      foundClass.students.push(studentId);
      await foundClass.save();
      res.status(200).send('Joined class successfully');
    } catch (error) {
      res.status(500).send('Error joining class: ' + error.message);
    }
  });

  module.exports = router;