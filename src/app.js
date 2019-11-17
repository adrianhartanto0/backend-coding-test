const express = require('express');
const bodyParser = require('body-parser');
const { postRides } = require('./handlers/postRides.handler');
const { getRideById } = require('./handlers/getRideById.handler');
const { getRides } = require('./handlers/getRides.handler');
const { getStatus } = require('./handlers/status.handler');

const { validateRiderId } = require('./middlewares/getRiderId.middleware');

const app = express();
const jsonParser = bodyParser.json();

module.exports = () => {
  app.get('/health', getStatus);

  app.post('/rides', jsonParser, postRides);

  app.get('/rides', getRides);

  app.get('/rides/:id', validateRiderId, getRideById);

  return app;
};
