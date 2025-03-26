const express = require('express');
const UserPlacesController = require('../controllers/userplaces.controller');
const { authOwnership } = require('../middlewares/auth.middleware');
const userplaces = express.Router();

userplaces.get('/favorites/', UserPlacesController.readUserPlaces);
userplaces.post('/favorites', UserPlacesController.createUserPlace);
userplaces.patch('/favorites/:id', authOwnership, UserPlacesController.updateUserPlace);
userplaces.delete('/favorites/:id', authOwnership, UserPlacesController.deleteUserPlace);

module.exports = userplaces;