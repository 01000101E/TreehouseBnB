'use strict';

// /** @type {import('sequelize-cli').Migration} */ //what is this?

const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://example.com/review_image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 1,
        url: 'https://example.com/review_image2.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 2,
        url: 'https://example.com/review_image3.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 2,
        url: 'https://example.com/review_image4.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 3,
        url: 'https://example.com/review_image5.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 4,
        url: 'https://example.com/review_image6.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },


    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://example.com/review_image1.jpg','https://example.com/review_image2.jpg','https://example.com/review_image3.jpg','https://example.com/review_image4.jpg','https://example.com/review_image5.jpg','https://example.com/review_image6.jpg',] }
    }, {})
  }
};