const Queue = require('bee-queue');
const { config: jobConfig } = require('./job.config');

exports.createJob = function (name, options) {
  const config = {
    redis: {
      host: jobConfig.redisHost,
      port: jobConfig.redisPort,
      username: jobConfig.redisUsername,
      password: jobConfig.redisPassword,
    },
  };

  return {
    dispatch: async (payload) => {
      const queue = new Queue(name, {
        isWorker: false,
        ...config,
      });

      await queue.createJob(payload.data).save();
    },
    process: () => {
      const queue = new Queue(name, config);

      queue.process(async (job) => {
        await options.handle(job.data);
        await options.onFinish(job);
      });
    },
  };
};
