const express = require('express');
const router = express.Router();
const { signupUser, loginUser, sendLoginEmail } = require('../controllers/auth');
const multer = require('multer');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/signup', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'qrCode', maxCount: 1 }
]), signupUser);

router.post('/login', loginUser);
router.post('/send-login-email', sendLoginEmail);

module.exports = router;
