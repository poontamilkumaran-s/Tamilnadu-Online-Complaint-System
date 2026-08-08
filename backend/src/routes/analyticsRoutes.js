const express = require('express');
const { getDashboardStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);

module.exports = router;
