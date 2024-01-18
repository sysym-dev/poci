const { Sequelize } = require('sequelize');
const { config } = require('./config.js');

exports.db = new Sequelize({
  dialect: 'mysql',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.name,
});
