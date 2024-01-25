const { DataTypes } = require('sequelize');
const { db } = require('../../../core/db/db');
const bcrypt = require('bcrypt');
const { getUploadedFileUrl } = require('../../../core/storage/storage.helper');

const UserDefinition = db.define(
  'user',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
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
    isEmailVerified: {
      type: DataTypes.VIRTUAL,
      get() {
        return !!this.emailVerifiedAt;
      },
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubId: {
      type: DataTypes.STRING,
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

exports.UserDefinition = UserDefinition;
