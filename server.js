const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    res.json({ success: true, message: `Welcome, ${username}!` });
  } else {
    res.status(400).json({ success: false, message: 'Username and password required' });
  }
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'feedback.html'));
});

app.post('/feedback', (req, res) => {
  const { name, rating, comments } = req.body;
  const ratingValue = Number(rating);
  if (!name || !comments || !Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    res.status(400).json({ success: false, message: 'Name, comments, and a rating from 1 to 5 are required' });
    return;
  }
  res.json({ success: true, message: `Thanks for your feedback, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
