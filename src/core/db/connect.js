const { db } = require('./db');

exports.connect = async function () {
  await db.authenticate();
};
