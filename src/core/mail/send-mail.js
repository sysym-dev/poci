const nodemailer = require('nodemailer');
const pug = require('pug');
const { config: mailConfig } = require('./mail.config');
const { config: appConfig } = require('../app/app.config');

exports.sendMail = async function (options) {
  const transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.password,
    },
  });

  const html = options.views
    ? pug.renderFile(options.views, {
        clientUrl: appConfig.clientUrl,
        clientName: appConfig.clientName,
        ...options.data,
      })
    : null;

  await transporter.sendMail({
    from: mailConfig.from,
    to: options.to,
    subject: options.subject,
    html: html,
  });
};
