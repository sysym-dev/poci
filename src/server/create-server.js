const express = require('express');
const morgan = require('morgan');
const { parseConfig } = require('./helpers/parse-config');

exports.createServer = function (options) {
  const server = express();
  const config = parseConfig(options);

  server.use(morgan(config.logFormat));

  function listen() {
    server.listen(config.port);

    console.log(`server listening at ${config.port}`);
  }

  return {
    listen,
  };
};
