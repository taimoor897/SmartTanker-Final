const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// CREATE PAYMENT
router.post('/create', async (req, res) => {
  try {
    const { orderId, customerId, amount, method, phone } = req.body;

    const payment = new Payment({
      orderId,
      customerId,
      amount,
      method,
      phone,
      status: 'pending'
    });

    await payment.save();

    res.json({
      success: true,
      message: 'OTP sent to phone (simulated)',
      paymentId: payment._id
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post('/verify-otp', async (req, res) => {
  try {
    const { paymentId, otp } = req.body;

    if (otp !== '1234') {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'paid',
        transactionId: 'TXN_' + Date.now()
      },
      { new: true }
    );

    await Order.findByIdAndUpdate(payment.orderId, {
      status: 'confirmed'
    });

    res.json({
      success: true,
      message: 'Payment successful',
      payment
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// SIMULATE PAYMENT SUCCESS
router.put('/success/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      {
        status: 'paid',
        transactionId: 'TXN_' + Date.now()
      },
      { new: true }
    );

    await Order.findByIdAndUpdate(payment.orderId, {
      status: 'accepted'
    });

    res.json({
      success: true,
      message: 'Payment successful',
      payment
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// GET PAYMENT STATUS
router.get('/:orderId', async (req, res) => {
  try {
    const payment = await Payment.findOne({
      orderId: req.params.orderId
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;