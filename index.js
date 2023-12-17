if (process.env.NODE_ENV === 'development') {
  require('dotenv/config');
}

const { createServer } = require('./src/server/create-server.js');
const { TaskResource } = require('./src/modules/task/task.resource.js');
const { connect } = require('./src/db/connect.js');

async function start() {
  try {
    await connect();

    const server = createServer({
      port: 3000,
      resources: [TaskResource],
    });

    server.listen();
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

start();
