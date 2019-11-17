
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const Chance = require('chance')();
const uuid = require('uuid/v4');

const app = require('../src/app')();
const utilsDB = require('../src/utils/db');

describe('API tests', () => {
  describe('GET /rides', () => {
    afterEach(() => {
      if (utilsDB.allAsync.restore) {
        utilsDB.allAsync.restore();
      }
    });

    it('Endpoint should be available', (done) => {
      request(app)
        .get('/rides')
        .expect(200, done);
    });

    it('If an error occurs retrieving rides, response must contain corrent payload', (done) => {
      sinon.stub(utilsDB, 'allAsync').rejects(new Error());

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

    it('If no rides data are available, response must contain corrent payload', (done) => {
      request(app)
        .get('/rides')
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

    it('If rides data are available and pagination was not provided, response must contain all ride data', async () => {
      const mockDBDataCount = Chance.integer({ min: 1, max: 100 });
      const mockData = [];

      for (let i = 0; i < mockDBDataCount; i += 1) {
        mockData.push({
          rideID: uuid(),
          startLat: Chance.latitude({ fixed: 5 }),
          startLong: Chance.longitude({ fixed: 5 }),
          endLat: Chance.latitude({ fixed: 5 }),
          endLong: Chance.longitude({ fixed: 5 }),
          riderName: Chance.string({ length: 5 }),
          driverName: Chance.string({ length: 5 }),
          driverVehicle: Chance.string({ length: 5 }),
        });
      }

      const insertQuery = 'INSERT INTO Rides(rideID, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

      await Promise.all(mockData.map(
        (data) => utilsDB.runAsync(insertQuery, Object.values(data)),
      ));

      return request(app)
        .get('/rides')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.length).to.be.equal(mockData.length);

          for (let i = 0; i < response.body.length; i += 1) {
            const {
              rideID, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle,
            } = response.body[i];

            expect(rideID).to.equal(mockData[i].rideID);
            expect(startLat).to.equal(mockData[i].startLat);
            expect(startLong).to.equal(mockData[i].startLong);
            expect(endLat).to.equal(mockData[i].endLat);
            expect(endLong).to.equal(mockData[i].endLong);
            expect(riderName).to.equal(mockData[i].riderName);
            expect(driverName).to.equal(mockData[i].driverName);
            expect(driverVehicle).to.equal(mockData[i].driverVehicle);
          }
        });
    });

    it('If invalid page pagination was given, response must contain correct error payload', (done) => {
      const invalidPagePagination = Chance.string({ alpha: true });
      const validQtyPagination = Chance.integer({ min: 1 });

      request(app)
        .get('/rides')
        .query({ page: invalidPagePagination })
        .query({ qty: validQtyPagination })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          const payload = response.body;
          expect(Object.keys(payload).length).to.be.equal(2);
          expect(payload).to.have.property('error_code');
          expect(payload).to.have.property('message');
          expect(payload.error_code).to.equal('VALIDATION_ERROR');
          expect(payload.message).to.equal('Value of page must be a positive integer');

          done();
        });
    });

    it('If invalid qty pagination was given, response must contain correct error payload', (done) => {
      const validPagePagination = Chance.integer({ min: 1 });
      const invalidQtyPagination = Chance.string({ alpha: true });

      request(app)
        .get('/rides')
        .query({ page: validPagePagination })
        .query({ qty: invalidQtyPagination })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          const payload = response.body;
          expect(payload).to.have.property('error_code');
          expect(payload).to.have.property('message');
          expect(payload.error_code).to.equal('VALIDATION_ERROR');
          expect(payload.message).to.equal('Value of qty must be a positive integer');
          done();
        });
    });

    it('If invalid page and qty pagination was given, response must contain correct error payload', (done) => {
      const invalidPagePagination = Chance.string({ alpha: true });
      const invalidQtyPagination = Chance.string({ alpha: true });

      request(app)
        .get('/rides')
        .query({ page: invalidPagePagination })
        .query({ qty: invalidQtyPagination })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          const payload = response.body;
          expect(Object.keys(payload).length).to.be.equal(2);
          expect(payload).to.have.property('error_code');
          expect(payload).to.have.property('message');
          expect(payload.error_code).to.equal('VALIDATION_ERROR');
          done();
        });
    });
  });
});
