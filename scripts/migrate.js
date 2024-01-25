if (process.env.NODE_ENV === 'development') {
  require('dotenv/config');
}

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

umzug.runAsCLI();
