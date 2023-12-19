const { TaskDefinition } = require('./task.definition');
const {
  TaskCategoryDefiniton,
} = require('../../task-category/model/task-category.definition');

TaskDefinition.belongsTo(TaskCategoryDefiniton, {
  foreignKey: {
    field: 'task_category_id',
    allowNull: false,
    name: 'task_category_id',
  },
  as: 'task_category',
});

exports.Task = TaskDefinition;
