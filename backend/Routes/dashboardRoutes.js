const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');

const router = express.Router();

// =========================
// DASHBOARD DATA ROUTE
// =========================
// role-based dashboard support via query (?role=customer/provider)
router.get('/data', getDashboardData);

module.exports = router;