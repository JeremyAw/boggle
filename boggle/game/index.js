const utility = require('./utility');
const db = require('../database/index.js');

const GRID_SIZE = 4; //todo: shift constant to another file

const createGame = async (req, res) => {
  const { duration, random } = req.body;
  let { board } = req.body;

  try {
    if (random) {
      board = utility.generateRandomBoard();
    } else {
      // Use default board if user did not provide custom board
      if (board == null || board == undefined) {
        board = await utility.generateDefaultBoard();
      } else {
        // Check validity of custom board
        if (!utility.isValidBoard(board)) {
          return res
            .status(400)
            .send(
              `Invalid board given. Board must be a ${GRID_SIZE *
                GRID_SIZE} character long, comma-separated string.`
            );
        }
      }
    }

    const token = utility.generateToken();
    let time_created = new Date().getTime();
    time_created = Math.floor(time_created / 1000);
    const points = 0;

    const response = {
      token: token,
      duration: duration,
      board: board
    };

    const insertSQL = 'INSERT INTO boggle_games VALUES (?, ?, ?, ?, ?, ?)';
    const insertParams = [null, token, duration, board, time_created, points];
    db.run(insertSQL, insertParams, function(error) {
      if (error) {
        console.log(
          `Error occurred inserting new game into boggle_games table: ${error}`
        );
        throw error;
      }

      response.id = this.lastID;
      return res.status(201).send(response);
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send('An error occurred while processing your request.');
  }
};

module.exports = {
  createGame
};
