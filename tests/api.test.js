
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
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

    it('If an error occurs retrieving rides, response must contain corrent payload', (done) => {
      sinon.stub(db, 'all').yieldsRight(new Error('error'));

      request(app)
        .get('/rides')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Object.keys(response.body).length).to.be.equal(2);
          expect(response.body).to.have.property('error_code');
          expect(response.body).to.have.property('message');
          expect(response.body.error_code).to.equal('SERVER_ERROR');
          expect(response.body.message).to.equal('Unknown error');
          done();
        });
    });
  });
});
