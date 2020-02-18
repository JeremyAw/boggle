const express = require('express');
const router = express.Router();
const boggle = require('./game/index.js');

router.post('/games', boggle.createGame);

module.exports = router;
