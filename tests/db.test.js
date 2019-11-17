const { expect } = require('chai');
const sinon = require('sinon');

const utilsDB = require('../src/utils/db');

describe('DB tests', () => {
  let dbRunStub;
  let dbAllStub;

  before(() => {
    dbRunStub = sinon.stub(utilsDB.db, 'run');
    dbAllStub = sinon.stub(utilsDB.db, 'all');
  });

  after(() => {
    dbRunStub.restore();

    if (utilsDB.db.run.restore) {
      utilsDB.db.run.restore();
    }
  });

  it('runAsync must be of type function', () => {
    expect(typeof utilsDB.runAsync).to.equal('function');
  });

  it('runAsync must call the run function of db', async () => {
    dbRunStub.yieldsRight();
    await utilsDB.runAsync('', []);
    expect(dbRunStub.called).to.equal(true);
  });
});
