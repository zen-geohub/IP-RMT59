'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPlace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserPlace.belongsTo(models.User);
      UserPlace.belongsTo(models.Place);
    }
  }
  UserPlace.init({
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    PlaceId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'UserPlace',
  });
  return UserPlace;
};