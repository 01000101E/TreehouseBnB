'use strict';

// /** @type {import('sequelize-cli').Migration} */ //what is this?

const { Review } = require('../models');
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

    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        review: "We stays here, precious, but we don’t likes it! Too much sunlight, yes, yes, hurts our eyes!",
        stars: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        spotId: 1,
        review: "This humble abode is perfect for wizards needing a break from meddling in the affairs of others.",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        spotId: 1,
        review: "As a native of Hobbiton, I must say this hobbit hole has a lot going for it—cozy atmosphere.",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Great location, very modern.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        spotId: 2,
        review: 'Great place, very cozy!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Nice and modern apartment.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2] }
    }, {})
  }
};