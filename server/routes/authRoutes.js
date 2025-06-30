// server/routes/auth.js (or whichever file handles signup)

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const multer  = require('multer');
const path    = require('path');
const User    = require('../models/User');
const Worker  = require('../models/Worker');

// — Multer setup to accept both photo and qrCode fields —
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, Date.now() + '-' + baseName + ext);
  }
});

const upload = multer({ storage }).fields([
  { name: 'photo',  maxCount: 1 },
  { name: 'qrCode', maxCount: 1 }
]);

// — Signup Route —
router.post('/signup', upload, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,                // 'user' or 'worker'
      workSpecification,
      experience,
      location,
      phoneNumber,
    } = req.body;

    // basic validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // check if already exists
    const existsInUsers   = await User.findOne({ email });
    const existsInWorkers = await Worker.findOne({ email });
    if (existsInUsers || existsInWorkers) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // extract uploaded filenames
    const photoFilename  = req.files?.photo?.[0]?.filename  || null;
    const qrCodeFilename = req.files?.qrCode?.[0]?.filename || null;

    if (role === 'worker') {
      // create Worker
      const newWorker = new Worker({
        name,
        email,
        password: hashedPassword,
        role,
        workSpecification,
        experience,
        location,
        phoneNumber,
        photo:  photoFilename,
        qrCode: qrCodeFilename,
        available: true,
        booked: false,
      });

      await newWorker.save();

      return res.status(201).json({
        message: 'Worker registered successfully',
        user: {
          _id: newWorker._id,
          name: newWorker.name,
          email: newWorker.email,
          role: newWorker.role,
          phoneNumber: newWorker.phoneNumber,
          location: newWorker.location,
          workSpecification: newWorker.workSpecification,
          experience: newWorker.experience,
          photo: newWorker.photo,
          qrCode: newWorker.qrCode,
        }
      });
    }

    // otherwise create regular User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      phoneNumber,
      photo:  photoFilename,
      qrCode: qrCodeFilename,
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
        location: newUser.location,
        photo: newUser.photo,
        qrCode: newUser.qrCode,
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

// — Login Route remains unchanged —
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let account = await User.findOne({ email });
    let role    = 'user';
    if (!account) {
      account = await Worker.findOne({ email });
      role    = 'worker';
    }
    if (!account) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        _id:         account._id,
        name:        account.name,
        email:       account.email,
        role,
        phoneNumber: account.phoneNumber,
        location:    account.location,
        photo:       account.photo,
        qrCode:      account.qrCode,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
