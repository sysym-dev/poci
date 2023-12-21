const { Sequelize } = require('sequelize');
const { config } = require('./config.js');

exports.sequelize = new Sequelize({
  dialect: 'mysql',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.name,
});
