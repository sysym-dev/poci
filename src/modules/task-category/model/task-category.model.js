const { TaskCategoryDefiniton } = require('./task-category.definition');
const { TaskDefinition } = require('../../task/model/task.definition');

TaskCategoryDefiniton.hasMany(TaskDefinition);

exports.TaskCategory = TaskCategoryDefiniton;
