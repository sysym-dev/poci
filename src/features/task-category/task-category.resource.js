const Joi = require('joi');
const { TaskCategory } = require('./model/task-category.model.js');
const { Op } = require('sequelize');
const { optionalProperty } = require('../../core/utils/object.js');
const {
  createCountRelationAttribute,
} = require('../../core/resource/query/create-count-relation-attribute.js');

exports.TaskCategoryResource = class {
  url = '/task-categories';
  model = TaskCategory;

  attributes() {
    return [
      'id',
      'name',
      'description',
      'created_at',
      'updated_at',
      createCountRelationAttribute({
        model: this.model,
        relation: 'tasks',
        foreignKey: 'task_category_id',
        as: 'tasks_count',
      }),
      createCountRelationAttribute({
        model: this.model,
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
      description: Joi.string().optional().allow('', null),
    };
  }

  filterables() {
    return {
      search: Joi.string().optional().allow(null, ''),
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
