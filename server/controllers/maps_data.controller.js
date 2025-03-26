const axios = require('axios');
const maps_api = require('../helpers/maps_api');

class MapsDataController {
  static async readData(req, res, next) {
    try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
        throw { name: 'BadRequest', message: 'Latitude and longitude are required.' };
      }

      const { data } = await maps_api({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.MAPS_API_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.types,places.location,places.rating,places.primaryTypeDisplayName,places.iconMaskBaseUri,places.iconBackgroundColor"
        },
        data: {
          "maxResultCount": 5,
          "locationRestriction": {
            "circle": {
              "center": {
                "latitude": latitude,
                "longitude": longitude
              },
              "radius": 1500.0
            }
          }
        }
      });

      const geojson = {
        type: "FeatureCollection",
        features: data['places'].map(({ id, displayName: { text: displayName }, formattedAddress, iconBackgroundColor, iconMaskBaseUri, location: { latitude, longitude }, primaryTypeDisplayName: { text: primaryTypeDisplayName }, rating, types }) => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            properties: {
              id,
              displayName,
              formattedAddress,
              iconBackgroundColor,
              iconMaskBaseUri,
              primaryTypeDisplayName,
              rating,
              types
            }
          }
        })
      }

      res.status(200).json(geojson);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MapsDataController;