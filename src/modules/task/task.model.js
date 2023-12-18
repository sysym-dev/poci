const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/sequelize.js');
const { TaskCategory } = require('../task-category/task-category.model.js');

const Task = sequelize.define(
  'Task',
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

Task.belongsTo(TaskCategory, {
  foreignKey: {
    field: 'task_category_id',
    allowNull: false,
    name: 'task_category_id',
  },
});

exports.Task = Task;
