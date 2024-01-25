const { DataTypes } = require('sequelize');
const { db } = require('../../../core/db/db');

exports.RefreshTokenDefinition = db.define(
  'refreshToken',
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
