const express = require('express');
const passport = require('passport');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { csrfMiddleware, csrfToken } = require('../middleware/csrf');
const { googleCallback, getMe, logout, updateName } = require('../controllers/authController');

// OAuth routes are exempt from CSRF (they are redirects, not AJAX calls)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=error` }),
  googleCallback
);

// CSRF token endpoint — called by the frontend after login
router.get('/csrf', csrfToken);

// Protected endpoints — require authentication + CSRF validation on mutations
router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, csrfMiddleware, logout);
router.patch('/name', requireAuth, csrfMiddleware, updateName);

module.exports = router;
