'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        userId: 1, // Adjust based on your user IDs
        spotId: 1, // Adjust based on your spot IDs
        startDate: '2021-11-19',
        endDate: '2021-11-20',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Adjust based on your user IDs
        spotId: 2, // Adjust based on your spot IDs
        startDate: '2021-11-21',
        endDate: '2021-11-23',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Adjust based on your user IDs
        spotId: 3, // Adjust based on your spot IDs
        startDate: '2021-11-25',
        endDate: '2021-11-27',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2] }, // Adjust based on the user IDs used in the up method
    }, {});
  }
};
