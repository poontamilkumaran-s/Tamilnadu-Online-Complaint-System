const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, getAllUsers, updateUserRole } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    validate,
  ],
  register
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
    validate,
  ],
  login
);

router.get('/me', protect, getMe);

router.get('/users', protect, authorize('ADMIN'), getAllUsers);
router.put('/users/:id/role', protect, authorize('ADMIN'), updateUserRole);

module.exports = router;
