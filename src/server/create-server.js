const express = require('express');

exports.createServer = function (config) {
  const server = express();

  function listen() {
    server.listen(config.port);

    console.log(`server listening at ${config.port}`);
  }

  return {
    listen,
  };
};
