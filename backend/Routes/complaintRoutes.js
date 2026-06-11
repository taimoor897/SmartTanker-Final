const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// CREATE COMPLAINT
router.post('/create', async (req, res) => {
  try {
    const {
      customerId,
      orderId,
      type,
      description
    } = req.body;

    const complaint = new Complaint({
      customerId,
      orderId,
      type,
      description
    });

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET ALL COMPLAINTS
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find()
    .populate('customerId', 'name email')
    .populate('orderId')
    .sort({ createdAt: -1 });
    

    res.json(complaints);

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
});

// UPDATE STATUS
router.put('/resolve/:id', async (req, res) => {
  try {
    const complaint =
      await Complaint.findByIdAndUpdate(
        req.params.id,
        { status: 'Resolved' },
        { new: true }
      );

    res.json({
      success: true,
      complaint
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;