const express = require('express');

const server = express();

server.set('view engine', 'pug');

server.get('/', (req, res) => {
  return res.render('login');
});

server.listen(3000, () => {
  console.log('server listen at 3000');
});
