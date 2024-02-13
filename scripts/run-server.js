require('../src/core/env/load-env');

const { connect } = require('../src/core/db/connect.js');
const { server } = require('../index.js');

async function start() {
  try {
    await connect();

    server.listen();
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

start();
