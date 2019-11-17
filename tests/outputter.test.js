const { expect } = require('chai');
const Chance = require('chance')();

const { outputRows } = require('../src/utils/outputter');

describe('Outputter Test', () => {
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
