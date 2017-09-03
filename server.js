const path = require('path');
const express = require('express');
const server = express();

const Bookmark = require('./models/bookmark');

server.use('/views', express.static(path.resolve(__dirname, 'public', 'views')));

server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const apiV1Route = express.Router();
apiV1Route.get('/bookmarks', async (req, res) => {
  const bookmarks = await Bookmark.findAll();
  res.json(bookmarks);
});

server.use('/api/v1', apiV1Route);

server.listen('3000', () => {
  console.log('> Server is ready on port 3000.')
});
