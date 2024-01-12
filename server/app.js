// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');

require('dotenv').config();

// Initialize Express app
const app = express();

// Use bodyParser middleware
app.use(bodyParser.json());
app.use('/api/user', authRoutes);
app.use('/api/class', classRoutes);
app.use('/api/student', studentRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('CurveCracker Backend is Running');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));