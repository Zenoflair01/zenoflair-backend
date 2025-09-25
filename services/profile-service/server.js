// services/profile-service/server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('./supabaseClient');

const app = express();
app.use(express.json());

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/', authenticate, async (req, res) => {
  try {
    const {  user } = await supabase
      .from('users')
      .select('id, email, name, avatar_url')
      .eq('id', req.userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'profile', status: 'OK' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Profile service running on port ${PORT}`);
});