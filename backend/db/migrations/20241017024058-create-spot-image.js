'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spot_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      spotId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'spots', // Name of the referenced table
          key: 'id',
        },
        onDelete: 'CASCADE', // Ensures the image gets deleted when the spot is deleted
        onUpdate: 'CASCADE',
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      preview: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('spot_images');
  },
};
