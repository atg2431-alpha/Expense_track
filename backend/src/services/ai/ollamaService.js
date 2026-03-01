const http = require('http');

// ─── Configuration ────────────────────────────────────────────────────────────
const MODEL_NAME = 'deepseek-r1:1.5b';
const OLLAMA_BASE_URL = 'http://localhost:11434';
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Sends a prompt to Ollama and returns the raw response string.
 */
function ollamaGenerate(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL_NAME,
      prompt,
      stream: false,
    });

    const url = new URL(`${OLLAMA_BASE_URL}/api/generate`);
    const options = {
      hostname: url.hostname,
      port: url.port || 11434,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.response || '');
        } catch (err) {
          reject(new Error(`Failed to parse Ollama response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Ollama connection failed: ${err.message}`));
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Ollama request timed out'));
    });

    req.write(body);
    req.end();
  });
}

/**
 * Parses natural language expense text into structured data.
 * Returns: { type, amount, category, description, date }
 */
async function parseExpenseFromText(text) {
  const today = new Date().toISOString().split('T')[0];

  const prompt = `You are a financial data parser. Extract expense or income information from the user's text and return ONLY valid JSON with no explanation, no markdown, no code blocks.

Today's date: ${today}

Return this exact JSON structure:
{
  "type": "expense" or "income",
  "amount": <number>,
  "category": <one of: Food, Transport, Shopping, Entertainment, Health, Bills, Other, or a relevant word>,
  "description": <short description string>,
  "date": <ISO date string YYYY-MM-DD>
}

User text: "${text}"

JSON:`;

  const raw = await ollamaGenerate(prompt);

  // Extract JSON from the response (handle cases where model adds extra text)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from AI response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate required fields
  if (!parsed.amount || !parsed.type) {
    throw new Error('AI response missing required fields (amount, type)');
  }

  return {
    type: parsed.type === 'income' ? 'income' : 'expense',
    amount: Math.abs(parseFloat(parsed.amount)),
    category: parsed.category || 'Other',
    description: parsed.description || text,
    date: parsed.date ? new Date(parsed.date).toISOString() : new Date().toISOString(),
  };
}

module.exports = { parseExpenseFromText, MODEL_NAME, OLLAMA_BASE_URL };
