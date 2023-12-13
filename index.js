const { createServer } = require('./src/server/create-server.js');

const server = createServer({
  port: 3000,
});

server.listen();
