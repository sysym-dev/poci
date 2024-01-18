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
    photoFilename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photoUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.photoFilename) {
          return null;
        }

        return getUploadedFileUrl('users', 'photo', this.photoFilename);
      },
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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

UserDefinition.beforeUpdate((user) => {
  if (user.changed('email')) {
    user.emailVerifiedAt = new Date();
  }
});

exports.UserDefinition = UserDefinition;
