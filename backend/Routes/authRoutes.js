const express = require('express');
const { register, login } = require('../Controllers/authController');

const router = express.Router();

// =========================
// AUTH ROUTES
// =========================

// Register user (customer or provider)
router.post('/register', register);

// Login user (returns role in response)
router.post('/login', login);

module.exports = router;