const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');

// Import routes (to be created later)
// const studentRoutes = require('./routes/studentRoutes');
// const landlordRoutes = require('./routes/landlordRoutes');
// const apartmentRoutes = require('./routes/apartmentRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('CMU-SV Housing App API is running');
});

// Use routes (to be uncommented later)
// app.use('/api/students', studentRoutes);
// app.use('/api/landlords', landlordRoutes);
// app.use('/api/apartments', apartmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;