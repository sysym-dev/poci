const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../db/sequelize');
const bcrypt = require('bcrypt');

const UserDefinition = sequelize.define(
  'users',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    underscored: true,
  },
);

UserDefinition.beforeSave(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

exports.UserDefinition = UserDefinition;
