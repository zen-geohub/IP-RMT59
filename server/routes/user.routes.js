const express = require('express');
const user = express.Router();

user.post('/register', (req, res) => {
  res.send('Register');
});

user.post('/login', (req, res) => {
  res.send('Login');
});

module.exports = user;