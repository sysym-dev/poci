const { migration } = require('../../scripts/migrate');
const { connect } = require('../../src/core/db/connect');

module.exports = async () => {
  await connect();
  await migration.up();
};
