const User = require('../models/User');
const Worker = require('../models/Worker');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// ========== SIGNUP ==========
const signupUser = async (req, res) => {
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
      latitude,
      longitude,
    } = req.body;

    const photo = req.files?.photo?.[0]?.filename || null;
    const qrcode = req.files?.qrcode?.[0]?.filename || null;

    // Check for existing user/worker
    if (role === 'worker') {
      const existing = await Worker.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Worker already exists' });
    } else {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'worker') {
      const newWorker = new Worker({
        role,
        email,
        password: hashedPassword,
        name,
        workSpecification,
        experience,
        location,
        phoneNumber,
        photo,
        qrcode,
        latitude,
        longitude,
        available: true,
      });

      await newWorker.save();

      return res.status(201).json({
        user: {
          _id: newWorker._id,
          email: newWorker.email,
          name: newWorker.name,
          role: newWorker.role,
          phoneNumber: newWorker.phoneNumber,
          location: newWorker.location,
          workSpecification: newWorker.workSpecification,
          experience: newWorker.experience,
          photo: newWorker.photo,
          qrcode: newWorker.qrcode,
          latitude: newWorker.latitude,
          longitude: newWorker.longitude,
          available: newWorker.available
        },
      });
    } else {
      const newUser = new User({
        role,
        email,
        password: hashedPassword,
        name,
        location,
        phoneNumber,
        photo,
        qrcode,
        workSpecification,
        experience
      });

      await newUser.save();

      return res.status(201).json({
        user: {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          phoneNumber: newUser.phoneNumber,
          location: newUser.location,
          photo: newUser.photo,
          qrcode: newUser.qrcode,
          workSpecification: newUser.workSpecification,
          experience: newUser.experience,
        },
      });
    }
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

// ========== LOGIN ==========
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    let role = 'user';

    if (!user) {
      user = await Worker.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      role = 'worker';
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role,
        phoneNumber: user.phoneNumber,
        location: user.location,
        photo: user.photo,
        qrcode: user.qrcode,
        workSpecification: user.workSpecification,
        experience: user.experience,
        latitude: user.latitude,
        longitude: user.longitude,
        available: user.available,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== LOGIN LINK EMAIL (Optional) ==========
const sendLoginEmail = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email }); // Optional fallback

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Login Link',
      text: `Hello, here is your login confirmation!`,
    });

    res.json({ message: 'Login email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  signupUser,
  loginUser,
  sendLoginEmail,
};
