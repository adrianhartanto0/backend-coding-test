const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');


module.exports = {
  allAsync: (query, params) => (
    new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      });
    })
  ),
  runAsync: (query, params) => (
    new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      });
    })
  ),
  db,
};
