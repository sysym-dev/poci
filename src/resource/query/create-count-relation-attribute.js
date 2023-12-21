const { Sequelize } = require('sequelize');

exports.createCountRelationAttribute = function (config) {
  const where = [
    `${config.table}.id = ${config.relation}.${config.foreignKey}`,
  ];

  if (config.where) {
    where.push(
      Object.entries(config.where).map(
        ([field, value]) => `${config.relation}.${field} = '${value}'`,
      ),
    );
  }

  return [
    Sequelize.literal(
      `(SELECT COUNT(*) FROM ${config.relation} WHERE ${where.join(' AND ')})`,
    ),
    config.as,
  ];
};
