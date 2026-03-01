const express = require('express');
const router = express.Router();
const { googleLogin, getMe, updateMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.post('/google', googleLogin);

// Protected
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

module.exports = router;
