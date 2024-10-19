'use strict';

// /** @type {import('sequelize-cli').Migration} */ //what is this?

const { Spot } = require('../models');
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

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Cozy Cottage',
        description: 'Nestled in the rolling hills of Hobbiton, this charming and cozy hobbit hole offers a peaceful retreat for those seeking a tranquil countryside escape.',
        price: 150.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 1,
        address: '6301 Trife St',
        city: 'Hometown',
        state: 'HT',
        country: 'Spain',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Urban Homestead',
        description: "A palace of trife arts, where dreams come true. This sleek, open-concept artist's loft is the perfect blend of creativity and luxury. ",
        price: 100.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: '456 Elm St',
        city: 'Othertown',
        state: 'NY',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Modern Apartment',
        description: 'Experience the charm of New York City from this classic brownstone apartment located in the historic Upper West Side.',
        price: 200.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 3,
        address: '999 Ocean Ave',
        city: 'Beachtown',
        state: 'FL',
        country: 'USA',
        lat: 46.8596,
        lng: -94.1470,
        name: 'Beachfront Paradise',
        description: 'Wake up to the sound of waves and enjoy stunning ocean views from this modern Miami Beach house.',
        price: 500.00,
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Main St', '6301 Trife St', '456 Elm St'] }
    }, {})
  }
};