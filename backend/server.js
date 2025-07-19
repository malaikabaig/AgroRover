require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes import
const profileRoutes = require('./routes/profile');
const authRoutes = require('./routes/auth');
const captureRoutes = require('./routes/captureRoute');

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', captureRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
