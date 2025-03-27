const express = require('express');
const UserController = require('../controllers/user.controller');
const user = express.Router();

user.post('/google-login', UserController.googleLogin);
user.post('/register', UserController.register);
user.post('/login', UserController.login);

module.exports = user;