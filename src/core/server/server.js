const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createResourcesRouter } = require('../resource/router.js');
const { createErrorHandler } = require('./handlers/error.handler.js');
const { config: storageConfig } = require('../storage/storage.config.js');
const { config } = require('./server.config.js');

exports.createServer = function (options) {
  const server = express();
  const resources = options.resources;
  const routes = options.routes;

  server.use('/public', express.static(storageConfig.publicPath));
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(morgan('tiny'));
  server.use(createResourcesRouter(resources));

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
