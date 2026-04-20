const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

describe('the SQL in the `exercise.sql` file', () => {
  let db;
  let scriptPath;

  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '..', 'lesson3.db');
    db = new sqlite3.Database(dbPath);

    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
  });

  afterAll(() => {
    db.close();
  });

  it('should return the `department` column from the `Grocery` table without any duplicate years', async () => {
      const results = await runScript(db, scriptPath);
      let departments = [];
      results.forEach((row) => {
        departments.push(row.DEPARTMENT)
      });
      const expectedDepartments = ['Produce', 'Dry Goods', 'Dairy', 'Frozen', 'Deli', 'Pets']
      expect(departments.sort()).toEqual(expectedDepartments.sort());
  });
});
