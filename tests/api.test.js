
const request = require('supertest');
const buildSchemas = require('../src/schemas');

const utilsDB = require('../src/utils/db');

const app = require('../src/app')();

describe('API tests', () => {
  before((done) => {
    utilsDB.db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(utilsDB.db);

      return done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });
});
