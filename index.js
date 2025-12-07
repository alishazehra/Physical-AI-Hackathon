const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing

// Mock user storage (in-memory, not persistent)
const users = {};

app.post('/api/auth/signup', (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (users[email]) {
    return res.status(409).json({ message: 'User with this email already exists.' });
  }

  // In a real app, password would be hashed and stored securely
  users[email] = { fullName, password };
  console.log('New user signed up:', { fullName, email });

  res.status(201).json({ message: 'Signup successful!', user: { fullName, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = users[email];
  if (!user || user.password !== password) { // Simple comparison for mock, no hashing
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  console.log('User logged in:', { email });
  // In a real app, a secure token (e.g., JWT) would be issued
  res.status(200).json({ message: 'Login successful!', user: { fullName: user.fullName, email }, token: 'mock-jwt-token' });
});

app.listen(PORT, () => {
  console.log(`Mock auth server listening on http://localhost:${PORT}`);
});
