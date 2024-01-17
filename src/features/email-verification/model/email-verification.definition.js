const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../db/sequelize');

exports.EmailVerificationDefinition = sequelize.define(
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
