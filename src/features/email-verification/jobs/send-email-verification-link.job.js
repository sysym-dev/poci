const { createJob } = require('../../../core/job/job');
const { sendMail } = require('../../../core/mail/send-mail');

exports.sendEmailVerificationLinkJob = createJob('SendEmailVerificationLink', {
  handle: (data) => sendMail(data),
  onFinish: () => console.log('Verification Email Link Sent'),
});
