const fs = require('fs');
const util = require('util');
const path = require('path');
const uuidv4 = require('uuid/v4');
const constants = require('../constants.js');

const GRID_SIZE = constants.GRID_SIZE;
const readFile = util.promisify(fs.readFile);

const generateDefaultBoard = async () => {
  try {
    let boardData = await readFile(
      path.join(__dirname, './test_board.txt'),
      'utf8'
    );

    return boardData.trim();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const generateRandomBoard = () => {
  let boardData = '';
  const allCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ*';

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    let randomCharacter = allCharacters.charAt(
      Math.floor(Math.random() * allCharacters.length)
    );

    boardData += randomCharacter;
    if (i != GRID_SIZE * GRID_SIZE - 1) {
      boardData += ', ';
    }
  }

  return boardData.trim();
};

const isValidBoard = board => {
  const boardData = board.split(', ');

  // Check for correct board input length
  if (boardData.length !== GRID_SIZE * GRID_SIZE) {
    return false;
  }

  let isValid = true;
  const regex = RegExp(/[a-z\*]/i);
  // Check for valid ASCII characters and *
  boardData.map(eachCharacter => {
    if (!regex.test(eachCharacter)) {
      isValid = false;
    }
  });

  return isValid;
};

const createBoardState = board => {
  const boardData = board.split(', ');

  const boardState = [];
  let currentRow = [];

  for (let i = 0; i < boardData.length; i++) {
    let currentCharacter = boardData[i];
    currentRow.push(currentCharacter);

    if (i % GRID_SIZE === GRID_SIZE - 1) {
      boardState.push(currentRow);
      currentRow = [];
    }
  }

  return boardState;
};

const isValidEnglishWord = async word => {
  try {
    const fileData = await readFile(
      path.join(__dirname, './dictionary.txt'),
      'utf8'
    );

    const dictionaryArray = fileData.split(/\n/);
    let isValid;

    if (dictionaryArray.indexOf(word) === -1) {
      isValid = false;
    } else {
      isValid = true;
    }

    return isValid;
  } catch (error) {
    throw error;
  }
};

const isLegalMove = (boardState, word) => {
  const startingPoint = word[0];
  let isLegal = false;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let column = 0; column < GRID_SIZE; column++) {
      // Search for a match for the first letter of given word
      if (
        startingPoint.toUpperCase() === boardState[row][column] ||
        startingPoint === '*'
      ) {
        isLegal = wordSearch(boardState, word, 1, row, column);
      }

      // Terminate if given word is found
      if (isLegal) {
        break;
      }
    }

    if (isLegal) {
      break;
    }
  }

  return isLegal;
};

const wordSearch = (boardState, word, wordIndex, currentRow, currentColumn) => {
  // Terminate when all characters in given word are found
  if (wordIndex === word.length) {
    return true;
  }

  // Ensure that the search is within the board boundaries
  const rowStart = Math.max(0, currentRow - 1);
  const rowEnd = Math.min(GRID_SIZE - 1, currentRow + 1);
  const columnStart = Math.max(0, currentColumn - 1);
  const columnEnd = Math.min(GRID_SIZE - 1, currentColumn + 1);

  const characterToFind = word[wordIndex].toUpperCase();
  let isWordFound = false;

  // Search for next character in the 8 tiles surrounding the current character
  for (let row = rowStart; row < rowEnd + 1; row++) {
    for (let column = columnStart; column < columnEnd + 1; column++) {
      // Do not check against current character
      if (row === currentRow && column === currentColumn) {
        continue;
      }

      // If next character matches either same character or *, continue search recursively
      if (
        boardState[row][column] === characterToFind ||
        boardState[row][column] === '*'
      ) {
        isWordFound = wordSearch(boardState, word, wordIndex + 1, row, column);
      }

      //Terminate if given word is found
      if (isWordFound) {
        break;
      }
    }

    if (isWordFound) {
      break;
    }
  }

  return isWordFound;
};

const generateToken = () => {
  const token = uuidv4();

  const regex = /-/g;
  const strippedToken = token.replace(regex, '');

  return strippedToken;
};

const generateTimeCreated = () => {
  let time_created = new Date().getTime();
  time_created = Math.floor(time_created / 1000);

  return time_created;
};

const authenticateGame = (inputToken, actualToken) => {
  return inputToken === actualToken ? true : false;
};

const calculateScore = word => {
  // Clarified that scoring would be one point per character, instead of usual Boggle scoring system
  return word.length;
};

const calculateTimeLeft = (timeCreated, duration) => {
  const currentTime = generateTimeCreated();

  return currentTime - timeCreated > duration
    ? 0
    : duration - (currentTime - timeCreated);
};

const executeMove = (gameQuery, word) => {
  const response = { ...gameQuery };
  const boardState = createBoardState(gameQuery.board);
  const isLegal = isLegalMove(boardState, word);
  const isValidWord = isValidEnglishWord(word);

  if (isValidWord && isLegal) {
    response.points = calculateScore(word) + gameQuery.points;
    response.time_left = calculateTimeLeft(
      gameQuery.time_created,
      gameQuery.duration
    );
    response.status = true;
    return response;
  } else {
    response.status = false;
    return response;
  }
};

module.exports = {
  generateDefaultBoard,
  generateRandomBoard,
  isValidBoard,
  createBoardState,
  isValidEnglishWord,
  isLegalMove,
  generateToken,
  generateTimeCreated,
  authenticateGame,
  calculateScore,
  calculateTimeLeft,
  executeMove
};
