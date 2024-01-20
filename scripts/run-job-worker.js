if (process.env.NODE_ENV === 'development') {
  require('dotenv/config');
}

const { createJobWorker } = require('../src/core/job/job.worker');
const {
  sendEmailVerificationLinkJob,
} = require('../src/features/email-verification/jobs/send-email-verification-link.job');

const jobs = [sendEmailVerificationLinkJob];

createJobWorker(jobs);
