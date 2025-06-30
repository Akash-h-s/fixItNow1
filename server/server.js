// server.js

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path    = require('path');
require('dotenv').config();

const authRoutes   = require('./routes/authRoutes');
const userRoutes   = require('./routes/users');
const workerRoutes = require('./routes/workers');
const workersRoutes  = require('./routes/workerRoutes');  

const app = express();

// 1) Global middleware
app.use(cors());
app.use(express.json());

// 2) Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3) API routes (must appear before any React static or catch-all)
app.use('/api/auth',  authRoutes);    // signup / login
app.use('/api/users', userRoutes);    // user details / profile
app.use('/api/workers', workerRoutes);
app.use('/api/workerRoutes', workersRoutes);  // worker listing, booking, email, etc.

// 4) (Optional) Serve React build in production
// If you later build your React app into client/build, uncomment below:
//
// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

// 5) Connect to MongoDB & start the server
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bluejobs';
const PORT      = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
