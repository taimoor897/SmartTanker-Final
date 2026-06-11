const express = require('express');
const router = express.Router();

const {
  getUserStats,
  getUsersByRole
} = require('../Controllers/adminController');

router.get('/stats', getUserStats);
router.get('/users/:role', getUsersByRole);

module.exports = router;