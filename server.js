const path = require('path');
const express = require('express');
const server = express();

server.use('/views', express.static(path.resolve(__dirname, 'public', 'views')));

server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

server.listen('3000', () => {
  console.log('> Server is ready on port 3000.')
});
