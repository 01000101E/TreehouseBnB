'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,  // Make sure this user ID exists in your Users table
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123.00,
        createdAt: new Date(),
        updatedAt: new Date(),
        previewImage: 'https://example.com/image-url.jpg',
        avgRating: 4.5,
      },
      {
        ownerId: 2,  // Ensure this user ID exists too
        address: '456 Code St',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Code Academy',
        description: 'A great place for coding enthusiasts',
        price: 150.00,
        createdAt: new Date(),
        updatedAt: new Date(),
        previewImage: 'https://example.com/image-url2.jpg',
        avgRating: 4.0,
      },
      // Add more spots as needed
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'Code Academy'] }
    }, {});
  }
};
