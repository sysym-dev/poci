const express = require('express');
const morgan = require('morgan');
const { parseConfig } = require('./helpers/parse-config');
const { createResourcesRoute } = require('../resource/create-resources-route');

exports.createServer = function (options) {
  const server = express();
  const config = parseConfig(options);
  const resources = options.resources;

  server.use(morgan(config.logFormat));
  server.use(createResourcesRoute(resources));

  function listen() {
    server.listen(config.port);

    console.log(`server listening at ${config.port}`);
  }

  return {
    listen,
  };
};
