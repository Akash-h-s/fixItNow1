const express = require('express');
const router = express.Router();
const User = require('../models/User');
const upload = require('../middleware/upload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ========== SIGNUP ==========
router.post('/signup', upload.single('photo'), async (req, res) => {
  try {
    const {
      role,
      email,
      password,
      name,
      workSpecification,
      experience,
      location,
      phoneNumber,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
 const photoFilename  = req.files?.photo?.[0]?.filename  || null;
      const qrCodeFilename = req.files?.qrCode?.[0]?.filename || null;
    const newUser = new User({
      role,
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      location,
      workSpecification,
      experience,
      photo:photoFilename,
      qrCode: qrCodeFilename,
    });

    await newUser.save();

    res.status(201).json({
  user: {
    _id: newUser._id.toString(), // ✅ Add this
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    phoneNumber: newUser.phoneNumber,
    location: newUser.location,
  },
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name || user.username,
        phoneNumber: user.phoneNumber,
        location: user.location,
        workSpecification: user.workSpecification,
        experience: user.experience,
        photo: user.photo,
        qrCode:user.qrCode
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
