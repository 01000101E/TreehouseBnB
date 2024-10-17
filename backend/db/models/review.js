'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Define associations here
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User', // Alias for easier access in queries
      });
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: 'Spot', // Alias for easier access in queries
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        as: 'ReviewImages', // Alias for easier access in queries
      });
    }
  }

  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'Reviews', // Make sure this matches your migration table name
    underscored: true, // If your database columns are underscored, set to true
    timestamps: true, // Enables createdAt and updatedAt fields
  });

  return Review;
};
