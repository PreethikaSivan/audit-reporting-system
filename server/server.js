const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
  .then(() => console.log('MongoDB database connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const usersRouter = require('./api/users');
const observationsRouter = require('./api/observations'); // Import the new router

app.use('/api/users', usersRouter);
app.use('/api/observations', observationsRouter); // This line connects your API routes to the server

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
