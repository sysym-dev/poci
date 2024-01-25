if (process.env.NODE_ENV === 'development') {
  require('dotenv/config');
}

const { createJobWorker } = require('../src/core/job/job.worker');
const {
  sendEmailVerificationLinkJob,
} = require('../src/features/email-verification/jobs/send-email-verification-link.job');
const {
  sendResetPasswordLinkJob,
} = require('../src/features/forgot-password/jobs/send-reset-password-link.job');

const jobs = [sendEmailVerificationLinkJob, sendResetPasswordLinkJob];

createJobWorker(jobs);
