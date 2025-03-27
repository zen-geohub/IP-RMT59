const { UserPlace, Place } = require('../models');

class UserPlacesController {
  static async createUserPlace(req, res, next) {
    try {
      const { properties, geometry } = req.body;

      if (!properties || !geometry) {
        throw { name: 'BadRequest', message: 'Properties and geometry are required.' };
      }

      const [placeInstance] = await Place.findOrCreate({
        where: { 'properties.placeId': properties['placeId'] },
        defaults: {
          type: 'Feature',
          properties: {
            placeId: properties['placeId'],
            displayName: properties['displayName'],
            formattedAddress: properties['formattedAddress'],
            primaryTypeDisplayName: properties['primaryTypeDisplayName'],
            iconMaskBaseUri: properties['iconMaskBaseUri'],
            iconBackgroundColor: properties['iconBackgroundColor'],
            rating: properties['rating'],
          },
          geometry: {
            type: 'Point',
            coordinates: geometry['coordinates'],
          },
        },
      });

      const [userPlaceInstance] = await UserPlace.findOrCreate({
        where: { PlaceId: placeInstance['id'], UserId: req.user['id'] },
        defaults: { PlaceId: placeInstance['id'], UserId: req.user['id'] },
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
          },
        ],
      });

      if (!userPlaces || userPlaces.length === 0) {
        throw { name: 'NotFound', message: 'No places found for the user.' };
      }

      res.status(200).json(userPlaces);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserPlace(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      if (!notes) {
        throw { name: 'BadRequest', message: 'Notes are required.' };
      }

      const [rowsUpdated, updatedUserPlaces] = await UserPlace.update(
        { notes },
        {
          where: { id },
          returning: true,
        }
      );

      if (rowsUpdated === 0) {
        throw { name: 'NotFound', message: 'User place not found.' };
      }

      res.status(200).json(updatedUserPlaces[0]);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserPlace(req, res, next) {
    try {
      const { id } = req.params;

      const rowsDeleted = await UserPlace.destroy({
        where: { id },
      });

      if (rowsDeleted === 0) {
        throw { name: 'NotFound', message: 'User place not found.' };
      }

      res.status(200).json({ message: 'Place has been removed from your list.' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserPlacesController;