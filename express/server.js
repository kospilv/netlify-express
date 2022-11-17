'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();

const redirectHandler = (req, res) => {
  const head = { 'Content-Type': 'text/html' };

  if (req.query.url) {
    res.writeHead(301, { ...head, Location: req.query.url || '/' });
  } else {
    res.writeHead(200, { ...head });
    res.write('<h1>No link, no redirect</h1>');
  }
  
  res.end();
};

router.get('/', redirectHandler);
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));
router.get('/redirect', redirectHandler);

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
