const User = require('../models/User');
const { seedUserCategories } = require('../services/storage');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const googleCallback = async (req, res) => {
  res.redirect(FRONTEND_URL);
};

const getMe = (req, res) => {
  const { _id, name, email, picture } = req.user;
  res.json({ id: _id.toString(), name, email, picture });
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
  });
};

const updateName = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    );
    res.json({ id: user._id.toString(), name: user.name, email: user.email, picture: user.picture });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { googleCallback, getMe, logout, updateName };
