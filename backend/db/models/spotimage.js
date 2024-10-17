'use strict';
module.exports = (sequelize, DataTypes) => {
  const SpotImage = sequelize.define(
    'SpotImage',
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots', // Name of the referenced table (Spots)
          key: 'id',
        },
        onDelete: 'CASCADE', // Delete images when the associated spot is deleted
        onUpdate: 'CASCADE',
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: 'spot_images',
      timestamps: true, // Enable createdAt and updatedAt fields
    }
  );

  // Associations
  SpotImage.associate = function (models) {
    // Each SpotImage belongs to a Spot
    SpotImage.belongsTo(models.Spot, {
      foreignKey: 'spotId',
      onDelete: 'CASCADE',
    });
  };

  return SpotImage;
};
