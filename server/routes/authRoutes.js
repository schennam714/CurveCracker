const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { studentId, email, password } = req.body;
    console.log("Request Body:", req.body);
    
    if (!email.endsWith('@utexas.edu')) {
      return res.status(400).send('Use UT Austin email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let student = new Student({ studentId, email, password: hashedPassword });
    await student.save();
    console.log("Student Registered:", student);

    res.status(201).send('Student registered');
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).send('Error registering student');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let student = await Student.findOne({ email });

    if (!student || !await bcrypt.compare(password, student.password)) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ _id: student._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send('Logged in');
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

module.exports = router;
