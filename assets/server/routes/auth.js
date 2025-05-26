const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    signup,
    login,
    logout,
    getMe
} = require('../controllers/authController');

// Validation middleware
const signupValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Please enter a valid 10-digit phone number').matches(/^\d{10}$/),
    check('password', 'Password must be at least 8 characters long')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

// Routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router; 