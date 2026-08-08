const express = require('express');
const { body } = require('express-validator');
const { submitFeedback, getFeedbacks } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    [
      body('complaintId', 'Complaint ID is required').not().isEmpty(),
      body('rating', 'Rating must be a number between 1 and 5').isInt({ min: 1, max: 5 }),
      validate,
    ],
    submitFeedback
  )
  .get(getFeedbacks);

module.exports = router;
