const sqlite3 = require('sqlite3').verbose();

const port = 8010;
const db = new sqlite3.Database(':memory:');

const app = require('./src/app')(db);
const { logInfo } = require('./src/utils/logger');
const buildSchemas = require('./src/schemas');

db.serialize(() => {
  buildSchemas(db);
  app.listen(port, () => logInfo(`App started and listening on port ${port}`));
});
