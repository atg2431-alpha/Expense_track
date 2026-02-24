const { parseExpenseFromText } = require('../services/ai');

const parseText = async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const result = await parseExpenseFromText(text.trim());
    res.json(result);
  } catch (err) {
    if (err.message.includes('Ollama connection failed') || err.message.includes('timed out')) {
      return res.status(503).json({
        error: 'AI service unavailable',
        detail: 'Make sure Ollama is running locally (ollama serve) and the llama3.2 model is pulled.',
      });
    }
    res.status(500).json({ error: 'Failed to parse text', detail: err.message });
  }
};

module.exports = { parseText };
