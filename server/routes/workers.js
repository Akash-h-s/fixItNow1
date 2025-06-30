const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const bcrypt = require('bcrypt');

// ✅ GET all available workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    console.error('Error fetching workers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/workers/signup
router.post('/signup', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      workSpecification,
      experience,
      location,
      phoneNumber,
      photo,
      latitude,
      longitude,
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email and password required' });
    }

    const existing = await Worker.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Worker already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = new Worker({
      name,
      email,
      password: hashedPassword,
      workSpecification,
      experience,
      location,
      phoneNumber,
      photo,
      latitude,
      longitude,
      available: true,
      booked: false,
    });

    await worker.save();

    res.status(201).json({ message: 'Worker registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// ✅ GET a specific worker’s email
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select('email');
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
