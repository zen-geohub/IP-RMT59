'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Places', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      placeId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      displayName: {
        type: Sequelize.STRING
      },
      formattedAddress: {
        type: Sequelize.STRING
      },
      primaryTypeDisplayName: {
        type: Sequelize.STRING
      },
      iconBaseMaskUri: {
        type: Sequelize.STRING
      },
      iconBackgroundColor: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Places');
  }
};