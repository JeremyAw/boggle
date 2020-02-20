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

const insertGame = (token, duration, board, timeCreated, points) => {
  return new Promise((resolve, reject) => {
    const insertSQL = `INSERT INTO boggle_games VALUES (?, ?, ?, ?, ?, ?)`;
    const insertParams = [null, token, duration, board, timeCreated, points];
    db.run(insertSQL, insertParams, function(error) {
      if (error) {
        console.log(
          `Error occurred inserting new game into boggle_games table: ${error}`
        );
        reject();
      }

      resolve(this.lastID);
    });
  });
};

const fetchGameByID = gameID => {
  return new Promise((resolve, reject) => {
    const querySQL = `SELECT * FROM boggle_games WHERE id = ?`;
    const queryParams = [gameID];
    db.get(querySQL, queryParams, function(error, result) {
      if (error) {
        console.log(`Error occurred querying boggle_games table: ${error}`);
        reject();
      }
      resolve(result);
    });
  });
};

const updateGameByID = (gameID, updatedPoints) => {
  return new Promise((resolve, reject) => {
    const updateSQL = `UPDATE boggle_games SET points = ? WHERE id = ?`;
    const updateParams = [updatedPoints, gameID];
    db.run(updateSQL, updateParams, function(error) {
      if (error) {
        console.log(`Error occurred updating boggle_games table: ${error}`);
        reject();
      }
      console.log(`Row(s) updated: ${this.changes}`);
      resolve();
    });
  });
};

module.exports = {
  db,
  insertGame,
  fetchGameByID,
  updateGameByID
};
