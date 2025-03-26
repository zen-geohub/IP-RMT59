'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Place.hasMany(models.UserPlace);
    }
  }
  Place.init({
    placeId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    displayName: DataTypes.STRING,
    formattedAddress: DataTypes.STRING,
    primaryTypeDisplayName: DataTypes.STRING,
    iconBaseMaskUri: DataTypes.STRING,
    iconBackgroundColor: DataTypes.STRING,
    rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Place',
  });
  return Place;
};