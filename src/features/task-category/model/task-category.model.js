const { TaskCategoryDefiniton } = require('./task-category.definition');
const { TaskDefinition } = require('../../task/model/task.definition');
const { UserDefinition } = require('../../user/model/user.definition');

TaskCategoryDefiniton.hasMany(TaskDefinition);
TaskCategoryDefiniton.belongsTo(UserDefinition, {
  foreignKey: {
    allowNull: false,
  },
});

exports.TaskCategory = TaskCategoryDefiniton;
