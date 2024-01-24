const { TaskDefinition } = require('./task.definition');
const {
  TaskCategoryDefiniton,
} = require('../../task-category/model/task-category.definition');
const { UserDefinition } = require('../../user/model/user.definition');

TaskDefinition.belongsTo(TaskCategoryDefiniton);
TaskDefinition.belongsTo(UserDefinition, {
  foreignKey: {
    allowNull: false,
  },
});

exports.Task = TaskDefinition;
