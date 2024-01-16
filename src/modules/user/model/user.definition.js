const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../db/sequelize');
const bcrypt = require('bcrypt');
const { getUploadedFileUrl } = require('../../../core/storage/storage.helper');

const UserDefinition = sequelize.define(
  'User',
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
    photo_filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo_url: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.photo_filename) {
          return this.photo_filename;
        }

        return getUploadedFileUrl('users', 'photo', this.photo_filename);
      },
    },
  },
  {
    tableName: 'users',
    underscored: true,
  },
);

UserDefinition.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

exports.UserDefinition = UserDefinition;
