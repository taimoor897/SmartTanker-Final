const express = require('express');
const router = express.Router();
const { sendLowLevelAlert } = require('../alertController'); // ✅ Import alert helper

// Temporary in-memory storage for tank levels
const tankLevels = [];

// Store latest ultrasonic distance separately for React frontend
let latestTankDistance = 0;

// Define alert threshold (percentage)
const ALERT_THRESHOLD = Number(process.env.ALERT_THRESHOLD || 20);

// 📡 POST — Receive data from IoT device (ultrasonic ESP32)
router.post('/tank-distance', async (req, res) => {
  const { distance, email, deviceId } = req.body;

  if (distance === undefined || typeof distance !== 'number' || distance < 0) {
    return res.status(400).json({ success: false, message: 'Invalid distance value' });
  }

  console.log(`📡 Received tank distance: ${distance} cm`);
  latestTankDistance = distance;

  // Convert distance to level % (adjust max distance as per your tank height)
  const MAX_TANK_HEIGHT = 100; // in cm (replace with actual tank height)
  let levelPercent = Math.max(0, Math.min(100, ((MAX_TANK_HEIGHT - distance) / MAX_TANK_HEIGHT) * 100));
  tankLevels.push({ level: levelPercent, time: new Date() });

  // ✅ Trigger email alert if level below threshold
  try {
    const recipient = email || process.env.ALERT_RECIPIENT;
    const id = deviceId || 'default';

    if (levelPercent < ALERT_THRESHOLD && recipient) {
      await sendLowLevelAlert(levelPercent, recipient, id);
    }
  } catch (err) {
    console.error('❌ Error sending low-level alert:', err.message);
  }

  res.json({ success: true, message: 'Distance received', data: { distance, levelPercent } });
});

// 🧾 GET — Return latest ultrasonic distance for frontend
router.get('/latest-distance', (req, res) => {
  res.json({ success: true, distance: latestTankDistance });
});

// 🧾 GET — Return latest 10 tank level entries (existing functionality)
router.get('/get-level', (req, res) => {
  res.json({
    success: true,
    data: tankLevels.slice(-10).reverse()
  });
});

module.exports = router;
