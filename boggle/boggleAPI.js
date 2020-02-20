const express = require('express');
const router = express.Router();
const boggle = require('./game/index.js');

router.post('/games', boggle.createGame);
router.put('/games/:id', boggle.playGame);
router.get('/games/:id', boggle.showGame);

module.exports = router;
