const { DataTypes } = require('sequelize');
const { db } = require('../../../core/db/db');

exports.EmailVerificationDefinition = db.define(
  'EmailVerification',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
    tableName: 'email_verifications',
    underscored: true,
  },
);
