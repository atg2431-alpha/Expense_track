const express = require('express');
const router = express.Router();
const { parseText } = require('../controllers/aiController');

router.post('/parse', parseText);

module.exports = router;
