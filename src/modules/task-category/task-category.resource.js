const Joi = require('joi');
const { TaskCategory } = require('./model/task-category.model.js');
const { Op } = require('sequelize');
const { optionalProperty } = require('../../utils/object.js');

exports.TaskCategoryResource = class {
  url = '/task-categories';
  model = TaskCategory;

  attributes() {
    return ['id', 'name', 'description', 'createdAt', 'updatedAt'];
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
