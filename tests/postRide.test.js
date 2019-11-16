const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');
const app = require('../src/app')(db);

describe('POST /rides', () => {
  it('Endpoint should be available', (done) => {
    request(app)
      .post('/rides')
      .expect(200, done);
  });
});
