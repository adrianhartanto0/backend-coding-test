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
    dbAllStub.restore();

    if (utilsDB.db.run.restore) {
      utilsDB.db.run.restore();
    }

    if (utilsDB.db.all.restore) {
      utilsDB.db.all.restore();
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

  it('allAsync must be of type function', () => {
    expect(typeof utilsDB.allAsync).to.equal('function');
  });

  it('allAsync must call all function of db', async () => {
    dbAllStub.yieldsRight();
    await utilsDB.allAsync('', []);
    expect(dbAllStub.called).to.equal(true);
  });

  it('if DB error occurs, runAsync must throw an error', async () => {
    dbRunStub.yieldsRight(new Error());
    let isThrowError;

    try {
      await utilsDB.runAsync('', []);
      isThrowError = false;
    } catch (e) {
      isThrowError = true;
    }

    expect(isThrowError).to.equal(true);
  });
});
