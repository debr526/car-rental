const express = require('express');
const { getSummary } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/dashboard/summary  - Admin only
router.get('/summary', authenticate, authorize('admin'), getSummary);

module.exports = router;
