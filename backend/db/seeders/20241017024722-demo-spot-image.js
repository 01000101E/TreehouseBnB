'use strict';

// /** @type {import('sequelize-cli').Migration} */ //what is this?

const { SpotImage } = require('../models');
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

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725900697/cntraveler_visiting-the-shire-by-drone_xpldjc.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725900789/old-times-farmhouse_vqd3px.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725907540/hobbiton_autumn-43_ho8ugo.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725907538/hobbiton_april-17-sjp-40_hfob5n.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725907538/bagshot_row_hero-2023-sjp-16_coihhk.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725907750/SRB_2311041310_send_web_nh0yhh.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725900871/WEB-10.jpg_g5jkz4.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725900873/60-West-15th-Street-11-1024x682_cdqf5c.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725907873/9715e7c4-0b8e-4922-8572-bf030499982b._mxpk28.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725907919/Big-Foot-Tours-1024x768_sxcm6n.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725901213/Treeframe_Cabin_3A_Cabins_in_Washington_nvlgcu.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725901216/1988780924_u1pqhl.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725901219/Cozy-cabin-interior-design-for-a-combined-living-and-dining-room-scaled_v0blb0.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725901220/bed_20lg_jgxhry.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725901222/1_SleepSoundly_z9qj9y.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725925476/How-to-Buy-a-Beach-House_rrflgv.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725925478/Maya_Luxe_Riviera_Maya__Beach_House_2021_HERO_2_meqksh.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725925476/tiny-beach-house-designs-for-privacy-6520-1685693866974_wsy1m2.webp',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725925477/hotel-2_b7ezth.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dmvfvyilq/image/upload/v1725925476/Desktop_Header-Ocean-View-from-North-Deck-at-the-Annenberg-Community-Beach-House_fg2413.jpg',
        preview: false,
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://example.com/cozy_cottage.jpg','https://example.com/urban_homestead_1.jpg','https://example.com/urban_homestead_2.jpg','https://example.com/modern_apartment_1.jpg','https://example.com/modern_apartment_2.jpg','https://example.com/modern_apartment_3.jpg'] }
    }, {})
  }
};