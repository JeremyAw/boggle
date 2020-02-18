const fs = require('fs');
const util = require('util');
const path = require('path');

const GRID_SIZE = 4;
const readFile = util.promisify(fs.readFile);

const generateDefaultBoard = async () => {
  try {
    let boardData = await readFile(
      path.join(__dirname, './test_board.txt'),
      'utf8'
    );

    return boardData.trim();
  } catch (error) {
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

isValidEnglishWord('library');
