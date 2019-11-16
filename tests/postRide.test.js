const request = require('supertest');
const Chance = require('chance')();
const { expect } = require('chai');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');
const app = require('../src/app')(db);

describe('POST /rides', () => {
  it('Endpoint should be available', (done) => {
    request(app)
      .post('/rides')
      .expect(200, done);
  });

  it('If rider start latitude is invalid, response must contain correct error payload', (done) => {
    const sampleInvalidLatitude = Chance.integer({ min: 100000, max: 150000 });

    request(app)
      .post('/rides')
      .send({ start_lat: sampleInvalidLatitude })
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
        done();
      });
  });

  it('If rider start longtitude is invalid, response must contain correct error payload', (done) => {
    const sampleInvalidLongtitude = Chance.integer({ min: 100000, max: 150000 });

    request(app)
      .post('/rides')
      .send({ start_long: sampleInvalidLongtitude })
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
        done();
      });
  });

  it('If rider start longtitude & latitude is valid, response must contain correct payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleValidLatitude = Chance.longitude({ fixed: 5 });

    request(app)
      .post('/rides')
      .send({ start_lat: sampleValidLatitude, start_long: sampleValidLongtitude })
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.not.equal('Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
        done();
      });
  });
});
