const maps_api = require('../helpers/maps_api');
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

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
          "X-Goog-FieldMask": "places.photos,places.id,places.displayName,places.formattedAddress,places.types,places.location,places.rating,places.primaryTypeDisplayName,places.iconMaskBaseUri,places.iconBackgroundColor"
        },
        data: {
          // "maxResultCount": 5,
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
        features: data?.places?.map((place) => {
          const {
            id = null,
            displayName: { text: displayName } = { text: "Unknown" },
            formattedAddress = "No address available",
            iconBackgroundColor = "#ccc",
            iconMaskBaseUri = "",
            location: { latitude, longitude } = { latitude: 0, longitude: 0 },
            primaryTypeDisplayName: { text: primaryTypeDisplayName } = { text: "N/A" },
            rating = "N/A",
          } = place || {};

          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            properties: {
              placeId: id,
              displayName,
              formattedAddress,
              iconBackgroundColor,
              iconMaskBaseUri,
              primaryTypeDisplayName,
              rating,
            }
          };
        })
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
          Based on this data: ${JSON.stringify(geojson)}, give me the top 5 places using this JSON schema:

          Feature = {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [longitude, latitude]
                },
                "properties": {
                  "placeId": "string",
                  "displayName": "string",
                  "formattedAddress": "string",
                  "iconBackgroundColor": "string",
                  "iconMaskBaseUri": "string",
                  "primaryTypeDisplayName": "string",
                  "rating": "string",
                }
              }
          Return: Array<Feature>
        `,
      });

      const result = response['text'].replace('```json', '').replace('```', '');

      res.status(200).json({ geojson, response: JSON.parse(result) });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MapsDataController;