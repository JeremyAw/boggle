const utility = require('./utility');
const db = require('../database/index.js');
const constants = require('../constants.js');

const GRID_SIZE = constants.GRID_SIZE;

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

    // Initialize new game data
    const token = utility.generateToken();
    const time_created = utility.generateTimeCreated();
    const points = constants.STARTING_POINTS;

    const id = await db.insertGame(
      token,
      duration,
      board,
      time_created,
      points
    );

    // Prepare response
    const response = {
      id: id,
      token: token,
      duration: duration,
      board: board
    };

    return res.status(201).send(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send('An error occurred while processing your request.');
  }
};

const playGame = async (req, res) => {
  const { id, token, word } = req.body;
  let isAuthenticated = false;

  try {
    let gameQuery = await db.fetchGameByID(id);

    // Authenticate game
    isAuthenticated = utility.authenticateGame(token, gameQuery.token);
    if (!isAuthenticated) {
      return res.status(401).send('Incorrect ID/token provided.');
    }

    // Execute move
    const response = utility.executeMove(gameQuery, word);
    if (response.status) {
      // Update points
      await db.updateGameByID(id, response.points);

      // Remove unncessary properties
      delete response.status;
      delete response.time_created;
      return res.status(200).send(response);
    } else {
      return res.status(400).send('Invalid move/word given.');
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send('An error occurred while processing your request.');
  }
};

module.exports = {
  createGame,
  playGame
};
