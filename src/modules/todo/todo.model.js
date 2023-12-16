const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sequelize.js');

exports.Todo = sequelize.define(
  'Todo',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['todo', 'inprogress', 'done'],
      defaultValue: 'todo',
      allowNull: false,
    },
  },
  {
    tableName: 'todos',
    underscored: true,
  },
);
