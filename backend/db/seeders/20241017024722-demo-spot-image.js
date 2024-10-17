'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('spot_images', [
      {
        spotId: 1, // Assuming this spot exists in your Spots table
        url: 'https://example.com/images/spot1-image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        url: 'https://example.com/images/spot1-image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://example.com/images/spot2-image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://example.com/images/spot2-image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        url: 'https://example.com/images/spot3-image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('spot_images', null, {});
  },
};
