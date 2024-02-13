require('../../core/env/load-env');

const { migration } = require('../../../scripts/migrate');
const { connect } = require('../../core/db/connect');

module.exports = async () => {
  await connect();
  await migration.up();
};
