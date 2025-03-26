const { UserPlace, Place, User } = require('../models');

class UserPlacesController {
  static async createUserPlace(req, res, next) {
    try {
      const { properties, geometry } = req.body;

      const [placeInstance] = await Place.findOrCreate({
        where: { 'properties.placeId': properties['placeId'] },
        defaults: {
          type: 'Feature',
          properties: {
            placeId: properties['placeId'],
            displayName: properties['displayName'],
            formattedAddress: properties['formattedAddress'],
            primaryTypeDisplayName: properties['primaryTypeDisplayName'],
            iconBaseMaskUri: properties['iconBaseMaskUri'],
            iconBackgroundColor: properties['iconBackgroundColor'],
            rating: properties['rating']
          },
          geometry: {
            type: 'Point',
            coordinates: geometry['coordinates']
          }
        }
      });

      const [userPlaceInstance] = await UserPlace.findOrCreate({
        where: { PlaceId: placeInstance['id'], UserId: req.user['id'] },
        defaults: { PlaceId: placeInstance['id'], UserId: req.user['id'] }
      });

      res.status(201).json(userPlaceInstance);
    } catch (error) {
      next(error);
    }
  }

  static async readUserPlaces(req, res, next) {
    try {
      const userPlaces = await UserPlace.findAll({
        where: { UserId: req.user['id'] },
        include: [
          {
            model: Place,
          }
        ]
      });

      res.status(200).json(userPlaces);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserPlace(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const userPlace = await UserPlace.update({
        notes
      }, {
        where: { id },
        returning: true
      });

      res.status(200).json(userPlace[1][0]);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserPlace(req, res, next) {
    try {
      const { id } = req.params;

      await UserPlace.destroy({
        where: { id }
      });

      res.status(200).json({ message: 'Place has been removed from your list.' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserPlacesController;