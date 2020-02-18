const utility = require('./utility');
const GRID_SIZE = 4;

const createGame = async (req, res) => {
  const { duration, random, board } = req.body;
  let boardData;

  if (random) {
    boardData = utility.generateRandomBoard();
  } else {
    if (board == null || board == undefined) {
      boardData = await utility.generateDefaultBoard();
    } else {
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
};

module.exports = {
  createGame
};
