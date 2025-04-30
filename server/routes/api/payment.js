// routes/payment.js

const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
require('dotenv').config();

// Setup Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/payment-config', async (req, res) => {
  res.json({
    key_id: process.env.RAZORPAY_KEY_ID
  });
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount, // convert to paise
      currency: 'INR',
      receipt: `receipt_order_${Math.random() * 1000}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order', error);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
