const { TaskDefinition } = require('./task.definition');
const {
  TaskCategoryDefiniton,
} = require('../../task-category/model/task-category.definition');

TaskDefinition.belongsTo(TaskCategoryDefiniton);

exports.Task = TaskDefinition;
