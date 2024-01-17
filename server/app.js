var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use('/api/user', authRoutes);
app.use('/api/class', classRoutes);
app.use('/api/student', studentRoutes);


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('CurveCracker Backend is Running');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));