const { DataTypes } = require('sequelize');
const { db } = require('../../../core/db/db');

exports.ForgotPasswordDefinition = db.define(
  'ForgotPassword',
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
    tableName: 'forgot_passwords',
    underscored: true,
  },
);
