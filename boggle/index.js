const express = require('express');
const helmet = require('helmet');
const boggleRouter = require('./boggleAPI.js');

// Enable environment variables
require('dotenv').config();

const app = express();
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Modularize route handlers
app.use('/boggle', boggleRouter);

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on ${process.env.NODE_ENV} mode. Listening on port ${process.env.PORT}!`
  );
});
