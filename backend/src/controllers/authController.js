const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const storage = require('../services/storage');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

/**
 * POST /api/auth/google
 * Body: { idToken: string, name?: string }
 */
const googleLogin = async (req, res) => {
  const { idToken, name } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'idToken is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, picture } = payload;
    const displayName = name || payload.name || email.split('@')[0];

    // Upsert user
    let user = await User.findOne({ googleId });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await User.create({
        googleId,
        email,
        name: displayName,
        picture: picture || '',
      });
      // Seed default categories for new user
      await storage.seedCategoriesForUser(user._id.toString());
    } else {
      // Update picture and email in case they changed
      user.email = email;
      user.picture = picture || user.picture;
      // Only update name if explicitly provided
      if (name) user.name = name;
      await user.save();
    }

    const token = signToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      isNewUser,
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/auth/me
 * Body: { name: string }
 */
const updateMe = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name.trim() },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { googleLogin, getMe, updateMe };
