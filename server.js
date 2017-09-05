const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const server = express();

const Bookmark = require('./models/bookmark');

server.use(bodyParser.json());

server.use('/', express.static(path.resolve(__dirname, 'public')));

server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const apiV1Route = express.Router();

apiV1Route.get('/bookmarks', async (req, res) => {
  const bookmarks = await Bookmark.findAll();
  res.json(bookmarks);
});

apiV1Route.post('/bookmarks', async (req, res) => {
  const { repo_id, full_name } = req.body;

  try {
    if (!repo_id || !full_name) {
      throw new Error('Missing parameters');
    }

    if (Math.round(Math.random())) {
      throw new Error('Something happended');
    }

    const bookmarks = await Bookmark.findOrCreate({ where: { repo_id, full_name } });

    res.json(bookmarks[0]);
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message });
  };
});

apiV1Route.delete('/bookmarks/:repo_id', async (req, res) => {
  const { repo_id } = req.params;

  try {
    if (Math.round(Math.random())) {
      throw new Error('Something happended');
    }

    await Bookmark.destroy({ where: { repo_id } });

    res.sendStatus(204);
  } catch (error) {
    res
      .sendStatus(404);
  }
})

server.use('/api/v1', apiV1Route);

server.listen('3000', () => {
  console.log('> Server is ready on port 3000.')
});
