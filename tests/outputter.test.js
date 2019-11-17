const { expect } = require('chai');
const Chance = require('chance')();

const {
  outputRows,
  outputServerError,
  outputRiderId,
  outputPage,
} = require('../src/utils/outputter');

describe('Outputter Test', () => {
  describe('outputRows Test', () => {
    it('outputRows shall be of type function', () => {
      expect(typeof outputRows).to.equal('function');
    });

    it('outputRows shall return empty object, if length of array is more than one', () => {
      const randomData = [];
      const randomItemCount = Chance.integer({ min: 1, max: 50 });

      for (let i = 0; i < randomItemCount; i += 1) {
        const randomString = Chance.string({ length: 5 });
        randomData.push(randomString);
      }

      const value = outputRows(randomData);
      expect(value).to.deep.equal(value);
    });

    it('outputRows shall return correct object, if array is empty', () => {
      const randomData = [];
      const value = outputRows(randomData);
      expect(value).to.have.property('error_code');
      expect(value).to.have.property('message');
      expect(value.error_code).to.equal('RIDES_NOT_FOUND_ERROR');
      expect(value.message).to.equal('Could not find any rides');
    });
  });

  describe('outputServerError Test', () => {
    it('outputServerError shall be of type function', () => {
      expect(typeof outputServerError).to.equal('function');
    });

    it('outputServerError shall return correct object', () => {
      const value = outputServerError();
      expect(value).to.have.property('error_code');
      expect(value).to.have.property('message');
      expect(value.error_code).to.equal('SERVER_ERROR');
      expect(value.message).to.equal('Unknown error');
    });
  });

  describe('outputRiderId Test', () => {
    it('outputRiderId shall be of type function', () => {
      expect(typeof outputRiderId).to.equal('function');
    });

    it('outputRiderId shall return correct object, if argument is invalid', () => {
      const invalidArgument = Chance.integer({ min: -100, max: -1 });
      const value = outputRiderId(invalidArgument);
      expect(value).to.have.property('error_code');
      expect(value).to.have.property('message');
      expect(value.error_code).to.equal('VALIDATION_ERROR');
      expect(value.message).to.equal('Rider Id must be positive integer');
    });

    it('outputRiderId shall return correct object, if argument is valid', () => {
      const validArgument = Chance.integer({ min: 1 });
      const value = outputRiderId(validArgument);
      expect(value).to.deep.equal({});
    });
  });

  describe('outputPage Test', () => {
    it('outputPage shall be of type function', () => {
      expect(typeof outputPage).to.equal('function');
    });

    it('outputPage shall return correct object, if argument is invalid', () => {
      const invalidArgument = Chance.integer({ min: -100, max: -1 });
      const value = outputPage(invalidArgument);
      expect(value).to.have.property('error_code');
      expect(value).to.have.property('message');
      expect(value.error_code).to.equal('VALIDATION_ERROR');
      expect(value.message).to.equal('Value of page must be a positive integer');
    });

    it('outputPage shall return correct object, if argument is valid', () => {
      const validArgument = Chance.integer({ min: 1 });
      const value = outputPage(validArgument);
      expect(value).to.deep.equal({});
    });
  });
});
