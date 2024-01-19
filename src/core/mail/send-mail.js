const nodemailer = require('nodemailer');
const pug = require('pug');
const { config } = require('./mail.config');

exports.sendMail = async function (options) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  const html = options.views
    ? pug.renderFile(options.views, options.data)
    : null;

  await transporter.sendMail({
    from: config.from,
    to: options.to,
    subject: options.subject,
    html: html,
  });
};
