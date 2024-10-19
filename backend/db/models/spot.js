'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true,
      });

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true,
      })

      // Spot.belongsToMany(models.User, {
      //   through: models.Booking,
      //   foreignKey: 'spotId',
      //   otherKey: 'userId',
      //   onDelete: 'CASCADE',
      //   hooks: true
      // });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required(value) {
          if (!value) {
            throw Error ('Street address is required')
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required(value) {
          if (!value) {
            throw Error ('City is required')
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required(value) {
          if (!value) {
            throw Error ('State is required')
          }
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required(value) {
          if (!value) {
            throw Error ('Country is required')
          }
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        range(value) {
          if (value < -90 || value > 90) {
            throw Error("Latitude must be within -90 and 90")
          }
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        range(value) {
          if (value < -180 || value > 180) {
            throw Error("Longitude must be within -180 and 180")
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        maxChar(value) {
          if (value.length >= 50) {
            throw Error ("Name must be less than 50 characters")
          }
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required(value) {
          if (!value) {
            throw Error ('Description is required')
          }
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        positive(value) {
          if (value <= 0) {
            throw Error ("Price per day must be a positive number")
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};