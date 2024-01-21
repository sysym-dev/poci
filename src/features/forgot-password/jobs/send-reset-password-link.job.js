const { createJob } = require('../../../core/job/job');
const { sendMail } = require('../../../core/mail/send-mail');

exports.sendResetPasswordLinkJob = createJob('SendResetPasswordLink', {
  handle: (data) => sendMail(data),
});
