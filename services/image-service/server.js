// services/image-service/server.js
const express = require('express');
const app = express();

app.post('/upload', (req, res) => {
  // TODO: Handle file upload to Supabase Storage
  res.json({ url: 'https://placehold.co/600x400' });
});

app.get('/health', (req, res) => {
  res.json({ service: 'image', status: 'OK' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`✅ Image service running on port ${PORT}`);
});