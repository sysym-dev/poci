const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { parseConfig } = require('./helpers/parse-config');
const { createResourcesRoute } = require('../resource/create-resources-route');
const {
  createErrorHandler,
} = require('../core/server/handlers/error.handler.js');
const { config: storageConfig } = require('../core/storage/storage.config.js');

exports.createServer = function (options) {
  const server = express();
  const config = parseConfig(options);
  const resources = options.resources;
  const routes = options.routes;

  server.use('/public', express.static(storageConfig.publicPath));
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(morgan(config.logFormat));
  server.use(createResourcesRoute(resources));

  for (const route of routes) {
    server.use(route);
  }

  server.use(createErrorHandler());

  function listen() {
    server.listen(config.port);

    console.log(`server listening at ${config.port}`);
  }

  return {
    listen,
  };
};
