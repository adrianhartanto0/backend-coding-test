
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const Chance = require('chance')();
const buildSchemas = require('../src/schemas');

const utilsDB = require('../src/utils/db');

let app;

describe('API tests', () => {
  let runAsyncStub;
  let allAsyncStub;

  before((done) => {
    utilsDB.db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(utilsDB.db);

      return done();
    });

    runAsyncStub = sinon.stub(utilsDB, 'runAsync');
    allAsyncStub = sinon.stub(utilsDB, 'allAsync');
    /* eslint-disable global-require */
    app = require('../src/app')();
  });

  beforeEach(() => {
  });

  afterEach(() => {
    if (utilsDB.allAsync.restore) {
      utilsDB.allAsync.restore();
    }

    if (utilsDB.runAsync.restore) {
      utilsDB.runAsync.restore();
    }
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
      runAsyncStub.rejects(new Error());

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
      runAsyncStub.resolves([]);

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

    it('If rides data are available and pagination was not provided, response must contain all ride data', (done) => {
      const mockDBDataCount = Chance.integer({ min: 1, max: 100 });
      const mockData = [];

      for (let i = 0; i < mockDBDataCount; i += 1) {
        mockData.push({
          rideId: i,
          startLat: Chance.latitude({ fixed: 5 }),
          startong: Chance.longitude({ fixed: 5 }),
          endLat: Chance.latitude({ fixed: 5 }),
          startLong: Chance.longitude({ fixed: 5 }),
          riderName: Chance.string({ length: 5 }),
          driverName: Chance.string({ length: 5 }),
          driverVehicle: Chance.string({ length: 5 }),
          created: Chance.date(),
        });
      }

      runAsyncStub.resolves(mockData);

      request(app)
        .get('/rides')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.length).to.be.equal(mockData.length);

          for (let i = 0; i < response.body.length; i += 1) {
            const {
              rideId, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle,
            } = response.body[i];

            expect(rideId).to.equal(mockData[i].rideId);
            expect(startLat).to.equal(mockData[i].startLat);
            expect(startLong).to.equal(mockData[i].startLong);
            expect(endLat).to.equal(mockData[i].endLat);
            expect(endLong).to.equal(mockData[i].endLong);
            expect(riderName).to.equal(mockData[i].riderName);
            expect(driverName).to.equal(mockData[i].driverName);
            expect(driverVehicle).to.equal(mockData[i].driverVehicle);
          }

          done();
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
          expect(payload.length).to.be.equal(1);

          payload.forEach((item) => {
            expect(Object.keys(item).length).to.be.equal(2);
            expect(item).to.have.property('error_code');
            expect(item).to.have.property('message');
            expect(item.error_code).to.equal('VALIDATION_ERROR');
            expect(item.message).to.equal('Value of page must be a positive integer');
          });

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
          expect(payload.length).to.be.equal(1);

          payload.forEach((item) => {
            expect(Object.keys(item).length).to.be.equal(2);
            expect(item).to.have.property('error_code');
            expect(item).to.have.property('message');
            expect(item.error_code).to.equal('VALIDATION_ERROR');
            expect(item.message).to.equal('Value of qty must be a positive integer');
          });

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
          expect(payload.length).to.be.equal(2);

          payload.forEach((item) => {
            expect(Object.keys(item).length).to.be.equal(2);
            expect(item).to.have.property('error_code');
            expect(item).to.have.property('message');
            expect(item.error_code).to.equal('VALIDATION_ERROR');
          });

          done();
        });
    });
  });

  describe('GET /rides/:id', () => {
    it('Endpoint should be available', (done) => {
      const randomId = Chance.integer({ min: 1, max: 100 });

      request(app)
        .get(`/rides/${randomId}`)
        .expect(200, done);
    });

    it('If an error occurs retrieving ride data, response must contain corrent payload', (done) => {
      allAsyncStub.rejects(new Error('error'));
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
      allAsyncStub.resolves([]);
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

      allAsyncStub.resolves(mockData);

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
