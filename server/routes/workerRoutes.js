const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const nodemailer = require('nodemailer');

// Configure email transporter outside the route for better performance
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'akash3arya@gmail.com',
    pass: process.env.GMAIL_PASS || 'crzdxjyaqcdkszjr',
  },
  tls: {
    rejectUnauthorized: false // For local testing only (remove in production)
  }
});

// Test email connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email server connection failed:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Book a worker and send email
router.post('/:id/book', async (req, res) => {
  try {
    const workerId = req.params.id;
    const { location, doorNumber, userId } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    console.log('📧 Preparing to send email to:', worker.email);

    // Update worker availability
    worker.available = false;
    await worker.save();

    // Email content
    const mailOptions = {
      from: `"Service Booking System" <${process.env.GMAIL_USER || 'akash3arya@gmail.com'}>`,
      to: worker.email,
      subject: 'You have a new booking!',
      html: `
        <h2>New Booking Notification</h2>
        <p>Hello ${worker.name},</p>
        <p>You have received a new booking request:</p>
        <ul>
          <li><strong>Location:</strong> ${location}</li>
          <li><strong>Door Number:</strong> ${doorNumber}</li>
          <li><strong>Customer ID:</strong> ${userId}</li>
        </ul>
        <p>Please prepare for the service call.</p>
        <p>Best regards,<br>Service Team</p>
      `,
      text: `Hello ${worker.name},\n\nYou have a new booking:\n- Location: ${location}\n- Door Number: ${doorNumber}\n- Customer ID: ${userId}\n\nPlease be prepared.`
    };

    // Send email with error handling
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${worker.email}`, info.messageId);

    // Re-enable worker after 5 mins
    setTimeout(async () => {
      try {
        const updatedWorker = await Worker.findById(workerId);
        if (updatedWorker) {
          updatedWorker.available = true;
          await updatedWorker.save();
          console.log(`✅ Worker ${updatedWorker.name} is now available again.`);
        }
      } catch (err) {
        console.error('Error re-enabling worker:', err);
      }
    }, 5 * 60 * 1000);

    res.status(200).json({ message: 'Worker booked and email sent successfully' });
  } catch (err) {
    console.error('❌ Booking error:', err);
    res.status(500).json({ 
      message: 'Server error during booking',
      error: err.message // Send error details for debugging
    });
  }
});

module.exports = router;