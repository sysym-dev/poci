exports.createJobWorker = (jobs) => {
  jobs.forEach((job) => {
    job.process();
  });
};
