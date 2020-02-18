const utility = require('./utility');
const GRID_SIZE = 4;

const createGame = async (req, res) => {
  const { duration, random, board } = req.body;
  let boardData;
  try {
    if (random) {
      boardData = utility.generateRandomBoard();
    } else {
      // Use default board if user did not provide custom board
      if (board == null || board == undefined) {
        boardData = await utility.generateDefaultBoard();
      } else {
        // Check validity of custom board
        if (utility.isValidBoard(board)) {
          boardData = board;
        } else {
          res
            .status(400)
            .send(
              `Invalid board given. Board must be a ${GRID_SIZE *
                GRID_SIZE} character long, comma-separated string.`
            );
        }
      }
    }

    const response = {
      duration: duration,
      board: boardData
    };

    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while processing your request.');
  }
};

module.exports = {
  createGame
};
