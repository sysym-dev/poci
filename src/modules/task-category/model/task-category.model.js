const { TaskCategoryDefiniton } = require('./task-category.definition');
const { TaskDefinition } = require('../../task/model/task.definition');

TaskCategoryDefiniton.hasMany(TaskDefinition, {
  foreignKey: 'task_category_id',
  as: 'tasks',
});

exports.TaskCategory = TaskCategoryDefiniton;
