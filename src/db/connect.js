const { sequelize } = require('./sequelize');

exports.connect = async function () {
  await sequelize.authenticate();
  await sequelize.sync();
};
