const crypto = require('crypto');

/**
 * CSRF protection middleware using the synchronizer token pattern.
 * Safe methods (GET, HEAD, OPTIONS) are exempt.
 * All other methods must include the X-CSRF-Token header matching the session token.
 */
const csrfMiddleware = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const token = req.headers['x-csrf-token'];
  if (!token || !req.session.csrfToken || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }
  next();
};

/**
 * Issues a CSRF token, storing it in the session.
 * Returns it to the client so it can be sent back in the X-CSRF-Token header.
 */
const csrfToken = (req, res) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.json({ csrfToken: req.session.csrfToken });
};

module.exports = { csrfMiddleware, csrfToken };
