const dotenv = require('dotenv');
const path = require('path');

const nodeEnv = process.env.NODE_ENV;

dotenv.config({
  path: path.resolve(
    __dirname,
    '../../../',
    nodeEnv ? `.env.${process.env.NODE_ENV}` : '.env',
  ),
});
