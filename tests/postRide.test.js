const request = require('supertest');
const Chance = require('chance')();
const { expect } = require('chai');

let app;

describe('POST /rides', () => {
  before(() => {
    /* eslint-disable global-require */
    app = require('../src/app')();
  });

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
    const sampleValidLatitude = Chance.latitude({ fixed: 5 });

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

  it('If rider end latitude is invalid, response must contain correct error payload', (done) => {
    const sampleInvalidLatitude = Chance.integer({ min: 100000, max: 150000 });
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleValidLatitude = Chance.latitude({ fixed: 5 });

    const requestPayload = {
      end_lat: sampleInvalidLatitude,
      start_lat: sampleValidLatitude,
      start_long: sampleValidLongtitude,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
        done();
      });
  });

  it('If rider end longtitude is invalid, response must contain correct error payload', (done) => {
    const sampleInvalidLongtitude = Chance.integer({ min: 100000, max: 150000 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const requestPayload = {
      end_long: sampleInvalidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively');
        done();
      });
  });

  it('If rider name is not of type string, response must contain correct error payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const invalidRiderName = Chance.integer();

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: invalidRiderName,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('Rider name must be a non empty string');
        done();
      });
  });

  it('If rider name is empty response must contain correct error payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const invalidRiderName = '';

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: invalidRiderName,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('Rider name must be a non empty string');
        done();
      });
  });

  it('If rider name is valid, response must contain correct success payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const validRiderName = Chance.string({ length: 5 });

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: validRiderName,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.not.equal('Rider name must be a non empty string');
        done();
      });
  });

  it('If driver name is not of type string, response must contain correct error payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const validRiderName = Chance.string({ length: 5 });
    const invalidDriverName = Chance.integer();

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: validRiderName,
      driver_name: invalidDriverName,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('Driver name must be a non empty string');
        done();
      });
  });

  it('If driver name is empty, response must contain correct error payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const invalidDriverName = '';
    const validRiderName = Chance.string({ length: 5 });

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: validRiderName,
      driver_name: invalidDriverName,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('Driver name must be a non empty string');
        done();
      });
  });

  it('If driver name is valid, response must contain correct success payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const validRiderName = Chance.string({ length: 5 });
    const validDriverName = Chance.string({ length: 5 });

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: validRiderName,
      driver_name: validDriverName,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.not.equal('Driver name must be a non empty string');
        done();
      });
  });

  it('If driver vehicle is not of type string, response must contain correct error payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const validRiderName = Chance.string({ length: 5 });
    const validDriverName = Chance.string({ length: 5 });
    const invalidDriverVehicle = Chance.integer();

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: validRiderName,
      driver_name: validDriverName,
      driver_vehicle: invalidDriverVehicle,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('Vehicle type must be a non empty string');
        done();
      });
  });

  it('If driver name is empty, response must contain correct error payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const validRiderName = Chance.string({ length: 5 });
    const validDriverName = Chance.string({ length: 5 });
    const invalidDriverVehicle = '';

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: validRiderName,
      driver_name: validDriverName,
      driver_vehicle: invalidDriverVehicle,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('error_code');
        expect(response.body).to.have.property('message');
        expect(response.body.error_code).to.equal('VALIDATION_ERROR');
        expect(response.body.message).to.equal('Vehicle type must be a non empty string');
        done();
      });
  });

  it('If driver vehicle is valid, response must contain correct payload', (done) => {
    const sampleValidLongtitude = Chance.longitude({ fixed: 5 });
    const sampleEndValidLatitude = Chance.latitude({ fixed: 5 });

    const sampleValidStartLatitude = Chance.latitude({ fixed: 5 });
    const sampleValidStartLongtitude = Chance.longitude({ fixed: 5 });

    const validRiderName = Chance.string({ length: 5 });
    const validDriverName = Chance.string({ length: 5 });
    const validDriverVehicle = Chance.string({ length: 5 });

    const requestPayload = {
      end_long: sampleValidLongtitude,
      end_lat: sampleEndValidLatitude,
      start_lat: sampleValidStartLatitude,
      start_long: sampleValidStartLongtitude,
      rider_name: validRiderName,
      driver_name: validDriverName,
      driver_vehicle: validDriverVehicle,
    };

    request(app)
      .post('/rides')
      .send(requestPayload)
      .expect(200)
      .then((response) => {
        expect(response.body).to.not.have.property('error_code');
        expect(response.body).to.not.have.property('message');
        done();
      });
  });
});
