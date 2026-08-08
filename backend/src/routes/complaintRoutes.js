const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignAgent,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    [
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
      body('category', 'Category is required').not().isEmpty(),
      validate,
    ],
    createComplaint
  )
  .get(getComplaints);

router
  .route('/:id')
  .get(getComplaintById)
  .delete(authorize('ADMIN'), deleteComplaint);

router.put('/:id/status', authorize('AGENT', 'ADMIN'), updateComplaintStatus);
router.put('/:id/assign', authorize('ADMIN'), assignAgent);

module.exports = router;
