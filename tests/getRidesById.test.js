
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const Chance = require('chance')();

const app = require('../src/app')();
const utilsDB = require('../src/utils/db');

describe('API tests', () => {
  describe('GET /rides/:id', () => {
    afterEach(() => {
      /* eslint-disable no-console */
      if (utilsDB.allAsync.restore) {
        utilsDB.allAsync.restore();
      }
    });
    it('Endpoint should be available', (done) => {
      const randomId = Chance.integer({ min: 1, max: 100 });

      request(app)
        .get(`/rides/${randomId}`)
        .expect(200, done);
    });

    it('If invalid rider id is passed, response must contain error payload', (done) => {
      sinon.stub(utilsDB, 'allAsync').rejects(new Error('error'));
      const invalidId = Chance.string({ alpha: true });

      request(app)
        .get(`/rides/${invalidId}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Object.keys(response.body).length).to.be.equal(2);
          expect(response.body).to.have.property('error_code');
          expect(response.body).to.have.property('message');
          expect(response.body.error_code).to.equal('VALIDATION_ERROR');
          expect(response.body.message).to.equal('Rider Id must be positive integer');
          done();
        });
    });

    it('If an error occurs retrieving ride data, response must contain corrent payload', (done) => {
      sinon.stub(utilsDB, 'allAsync').rejects(new Error('error'));
      const randomId = Chance.integer({ min: 1, max: 100 });

      request(app)
        .get(`/rides/${randomId}`)
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

    it('If no ride data are available, response must contain corrent payload', (done) => {
      sinon.stub(utilsDB, 'allAsync').resolves([]);
      const randomId = Chance.integer({ min: 1, max: 100 });

      request(app)
        .get(`/rides/${randomId}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Object.keys(response.body).length).to.be.equal(2);
          expect(response.body).to.have.property('error_code');
          expect(response.body).to.have.property('message');
          expect(response.body.error_code).to.equal('RIDES_NOT_FOUND_ERROR');
          expect(response.body.message).to.equal('Could not find any rides');
          done();
        });
    });

    it('If rides data are available, response must contain the same amount of data and the same data', (done) => {
      /* eslint-disable no-console */
      // console.log(allAsyncStub);

      const randomId = Chance.integer({ min: 1, max: 100 });
      const mockData = [];

      mockData.push({
        rideId: randomId,
        startLat: Chance.latitude({ fixed: 5 }),
        startong: Chance.longitude({ fixed: 5 }),
        endLat: Chance.latitude({ fixed: 5 }),
        startLong: Chance.longitude({ fixed: 5 }),
        riderName: Chance.string({ length: 5 }),
        driverName: Chance.string({ length: 5 }),
        driverVehicle: Chance.string({ length: 5 }),
        created: Chance.date(),
      });

      sinon.stub(utilsDB, 'allAsync').resolves(mockData);

      request(app)
        .get(`/rides/${randomId}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.length).to.be.equal(mockData.length);

          const {
            rideId, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle,
          } = response.body[0];

          expect(rideId).to.equal(mockData[0].rideId);
          expect(startLat).to.equal(mockData[0].startLat);
          expect(startLong).to.equal(mockData[0].startLong);
          expect(endLat).to.equal(mockData[0].endLat);
          expect(endLong).to.equal(mockData[0].endLong);
          expect(riderName).to.equal(mockData[0].riderName);
          expect(driverName).to.equal(mockData[0].driverName);
          expect(driverVehicle).to.equal(mockData[0].driverVehicle);

          done();
        });
    });
  });
});
