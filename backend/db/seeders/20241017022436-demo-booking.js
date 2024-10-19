'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Booking.bulkCreate([
        {
          spotId: 1,
          userId: 1,
          startDate: new Date('2024-08-01'),
          endDate: new Date('2024-08-07'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          spotId: 2,
          userId: 2,
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-09-07'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          spotId: 2,
          userId: 3,
          startDate: new Date('2024-10-01'),
          endDate: new Date('2024-10-07'),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          spotId: 3,
          userId: 1,
          startDate: new Date('2024-09-11'),
          endDate: new Date('2024-09-17'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { validate: true });
    } catch(err) {
      console.error("Error seeding bookings:", err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      options.tableName = 'Bookings';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
        spotId: { [Op.in]: [1, 2] }
      }, {});
    } catch(err) {
      console.error("Error deleting seeded bookings:", err);
      throw err;
    }
  }
};