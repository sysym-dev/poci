const Joi = require('joi');
const { TaskCategory } = require('./model/task-category.model.js');
const { Op } = require('sequelize');
const { optionalProperty } = require('../../utils/object.js');
const {
  createCountRelationAttribute,
} = require('../../resource/query/create-count-relation-attribute.js');

exports.TaskCategoryResource = class {
  url = '/task-categories';
  model = TaskCategory;

  attributes() {
    return [
      'id',
      'name',
      'description',
      'createdAt',
      'updatedAt',
      createCountRelationAttribute({
        table: 'task_categories',
        relation: 'tasks',
        foreignKey: 'task_category_id',
        as: 'tasks_count',
      }),
      createCountRelationAttribute({
        table: 'task_categories',
        relation: 'tasks',
        foreignKey: 'task_category_id',
        where: {
          status: 'done',
        },
        as: 'tasks_done_count',
      }),
    ];
  }

  schema(options) {
    return {
      name: options.isUpdating
        ? Joi.string().optional()
        : Joi.string().required(),
      description: Joi.string().optional(),
    };
  }

  filterables() {
    return {
      search: Joi.string().optional(),
    };
  }

  sortables() {
    return ['name'];
  }

  filter(query) {
    return {
      ...optionalProperty(query.search, {
        name: {
          [Op.substring]: query.search,
        },
      }),
    };
  }
};
