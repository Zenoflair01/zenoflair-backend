// gateway/server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'api-gateway',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Proxy routes
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/auth': '' },
  onError: (err, req, res) => {
    console.error('Auth proxy error:', err);
    res.status(502).json({ error: 'Auth service unavailable' });
  }
}));

app.use('/profile', createProxyMiddleware({
  target: process.env.PROFILE_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/profile': '' },
  onError: (err, req, res) => {
    res.status(502).json({ error: 'Profile service unavailable' });
  }
}));

app.use('/content', createProxyMiddleware({
  target: process.env.CONTENT_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: { '^/content': '' },
  onError: (err, req, res) => {
    res.status(502).json({ error: 'Content service unavailable' });
  }
}));

app.use('/image', createProxyMiddleware({
  target: process.env.IMAGE_SERVICE_URL || 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: { '^/image': '' },
  onError: (err, req, res) => {
    res.status(502).json({ error: 'Image service unavailable' });
  }
}));

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
  console.log(`   Auth: ${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}`);
  console.log(`   Profile: ${process.env.PROFILE_SERVICE_URL || 'http://localhost:3002'}`);
});