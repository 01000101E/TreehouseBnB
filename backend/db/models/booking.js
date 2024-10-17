'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Define associations here
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: 'Spot',
      });
    }
  }

  Booking.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter(value) {
            if (new Date(value) <= new Date(this.startDate)) {
              throw new Error('End date must be after start date.');
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'Bookings',
      underscored: true,
      timestamps: true,
    }
  );

  return Booking;
};
