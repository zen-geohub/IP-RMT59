const express = require('express');
const maps_data = express.Router();
const MapsDataController = require('../controllers/maps_data.controller');

maps_data.get('/places', MapsDataController.readData);

module.exports = maps_data;