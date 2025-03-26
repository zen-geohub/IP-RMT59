const { UserPlace, Place, User } = require('../models');

class UserPlacesController {
  static async createUserPlace(req, res, next) {
    try {
      const { poi } = req.body;

      const [placeInstance, createdPlace] = await Place.findOrCreate({
        where: { placeId: poi['placeId'] },
        defaults: poi
      });

      const [userPlaceInstance, createdUserPlace] = await UserPlace.findOrCreate({
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
            attributes: ['id', 'displayName', 'formattedAddress', 'primaryTypeDisplayName', 'iconBaseMaskUri', 'iconBackgroundColor', 'rating']
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