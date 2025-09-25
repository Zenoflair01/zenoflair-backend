// services/content-service/server.js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/generate', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  // TODO: Replace with real AI API
  const content = `AI-generated content for: "${prompt}"`;
  res.json({ content });
});

app.get('/health', (req, res) => {
  res.json({ service: 'content', status: 'OK' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`✅ Content service running on port ${PORT}`);
});