const port = 8010;
const { db } = require('./src/utils/db');

const app = require('./src/app')();
const { logInfo } = require('./src/utils/logger');
const buildSchemas = require('./src/schemas');

db.serialize(() => {
  buildSchemas(db);
  app.listen(port, () => logInfo(`App started and listening on port ${port}`));
});
