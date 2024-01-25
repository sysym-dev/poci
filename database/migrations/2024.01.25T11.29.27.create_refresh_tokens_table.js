const { DataTypes } = require('sequelize');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('refresh_tokens', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('refresh_tokens');
};
