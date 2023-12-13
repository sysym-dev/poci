exports.parseConfig = function (options) {
  return {
    logFormat: options.logFormat || 'tiny',
    port: options.port || 3000,
  };
};
