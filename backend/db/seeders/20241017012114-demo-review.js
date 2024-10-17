'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoUser = await User.findOne({ where: { username: 'Demo-lition' } });
    const spot1 = await Spot.findOne({ where: { id: 1 } }); // Adjust based on your actual spot IDs
    const spot2 = await Spot.findOne({ where: { id: 2 } }); // Adjust based on your actual spot IDs

    await Review.bulkCreate([
      {
        userId: demoUser.id,
        spotId: spot1.id,
        review: 'This was an awesome spot!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: demoUser.id,
        spotId: spot2.id,
        review: 'Had a great time, highly recommend this place!',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: demoUser.id,
        spotId: spot1.id,
        review: 'Not bad, but it could be better.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Assuming user with ID 2 exists
        spotId: spot2.id,
        review: 'Great experience overall!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3, // Assuming user with ID 3 exists
        spotId: spot1.id,
        review: 'Would not recommend.',
        stars: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: {
        [Op.in]: [
          'This was an awesome spot!',
          'Had a great time, highly recommend this place!',
          'Not bad, but it could be better.',
          'Great experience overall!',
          'Would not recommend.'
        ]
      }
    }, {});
  }
};
