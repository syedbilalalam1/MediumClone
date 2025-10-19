import { Router } from 'express';

const router = Router();

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'qwen/qwen3-235b-a22b:free';
    const base = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    if (!apiKey) return res.status(400).json({ error: 'Missing OpenRouter API key' });
    const r = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost',
        'X-Title': 'Medium Clone',
      },
      body: JSON.stringify({ model, messages }),
    });
    const json = await r.json();
    if (!r.ok) return res.status(r.status).json(json);
    res.json({ content: json.choices?.[0]?.message?.content || '' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;


