require('../src/core/env/load-env');

const { Umzug, SequelizeStorage } = require('umzug');
const { db } = require('../src/core/db/db');

const umzug = new Umzug({
  migrations: {
    glob: 'database/migrations/*.js',
  },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),
  logger: console,
});

if (require.main === module) {
  umzug.runAsCLI();
}

exports.migration = umzug;
