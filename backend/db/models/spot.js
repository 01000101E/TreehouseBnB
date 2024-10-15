'use strict';

const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/database'); // Adjust the path as necessary

class Spot extends Model {}

Spot.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.STRING(255), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: false },
  country: { type: DataTypes.STRING(100), allowNull: false },
  lat: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  lng: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  previewImage: { type: DataTypes.STRING(255), allowNull: true },
  avgRating: { type: DataTypes.FLOAT, allowNull: true },
}, { sequelize, modelName: 'Spot' });

module.exports = Spot;