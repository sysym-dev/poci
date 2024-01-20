const sequelize = require('sequelize');

exports.createResourceAttributesQuery = function (resource) {
  return [...resource.attributes()];
};
