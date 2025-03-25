const axios = require('axios');

const maps_api = axios.create({
  baseURL: 'https://places.googleapis.com/v1/places:searchNearby',
});

module.exports = maps_api;