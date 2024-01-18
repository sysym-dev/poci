const { DataTypes } = require('sequelize');
const { db } = require('../../../core/db/db.js');

const TaskCategoryDefiniton = db.define(
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
