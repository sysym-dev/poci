const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../db/sequelize');

exports.RefreshTokenDefinition = sequelize.define(
  'RefreshToken',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'refresh_tokens',
    underscored: true,
  },
);
