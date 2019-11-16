
const request = require('supertest');
const sqlite3 = require('sqlite3').verbose();
const buildSchemas = require('../src/schemas');

const db = new sqlite3.Database(':memory:');
const app = require('../src/app')(db);

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

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

  describe('GET /rides', () => {
    it('Endpoint should be available', (done) => {
      request(app)
        .get('/rides')
        .expect(200, done);
    });
  });
});
