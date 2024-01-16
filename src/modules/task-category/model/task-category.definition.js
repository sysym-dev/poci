const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../db/sequelize.js');

const TaskCategoryDefiniton = sequelize.define(
  'TaskCategory',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'task_categories',
    underscored: true,
  },
);

exports.TaskCategoryDefiniton = TaskCategoryDefiniton;
