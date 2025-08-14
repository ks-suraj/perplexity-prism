// server/index.js (ESM)
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/ask', async (req, res) => {
  try {
    const { question, contextPath = [] } = req.body || {};
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Missing "question" (string)' });
    }

    const messages = [
      {
        role: 'system',
        content:
          'You are Perplexity Prism research assistant. Answer clearly and concisely. If a context path is provided, use it to keep answers consistent along the research tree.',
      },
      {
        role: 'user',
        content: `Context path (root → current):
${contextPath.map((q, i) => `${i + 1}. ${q}`).join('\n') || '(none)'}
  
User question:
${question}`,
      },
    ];

    const apiRes = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-pro',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PPLX_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60_000,
      }
    );

    const answer = apiRes.data?.choices?.[0]?.message?.content ?? '';
    res.json({ answer, raw: apiRes.data });
  } catch (err) {
    const detail = err?.response?.data || err.message || 'Unknown error';
    console.error('Perplexity proxy error:', detail);
    res.status(500).json({ error: 'Perplexity request failed', detail });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
