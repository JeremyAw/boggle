const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const constants = require('../constants.js');

let db = new sqlite3.Database(
  path.join(__dirname, constants.DATABASE_FILE),
  error => {
    if (error) {
      return console.error(error.message);
    } else {
      console.log('Connected to  SQLite database.');

    // Create table if it doesn't exist
    db.run(
      'CREATE TABLE boggle_games(id INTEGER PRIMARY KEY, token TEXT, duration INTEGER, board TEXT, time_created INTEGER, points INTEGER)',
      error => {
        if (error) {
          return console.error(error.message);
        } else {
          console.log('Created boggle_games table.');
        }
      }
    );
  }
});

module.exports = db;
