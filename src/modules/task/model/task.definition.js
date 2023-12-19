const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../db/sequelize');

const TaskDefinition = sequelize.define(
  'tasks',
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
      values: ['todo', 'in-progress', 'done'],
      defaultValue: 'todo',
      allowNull: false,
    },
  },
  {
    tableName: 'tasks',
    underscored: true,
  },
);

exports.TaskDefinition = TaskDefinition;
