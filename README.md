## Introduction

I decided to use Node.js to build the backend API due to the following reasons:

- Prior experience building APIs with Node.js
- There are existing libraries and packages for building REST APIs with JSON payloads
- Short time frame to build a prototype

To elaborate further, despite being given 2 weeks for this assignment, I feel that there is a need to build as quickly as possible. This is in addition to other commitments (e.g school) which does not allow me to work on this assignment alone full-time (unlike a full-time job). Hence, I placed higher emphasis on speed and execution.

## Assumptions

I am working under certain assumptions and constraints:

- Single player
- API responses in the range of milliseconds are acceptable for the user
- Database has to be local

I am making the assumption that this game of boggle can be played by anyone by simply starting the backend server and playing via a HTTP client. Hence,I decided to use a local database which will start up when the user starts the backend server. The user will not have to worry about hosting/starting up a database remotely whenever he wishes to play this game, saving him time and resources (no need to pay for any remote hosting).

I decided to use SQLite as it is file-based, allowing us to do local storage. Furthermore, according to the requirements, this is for a single-player game of boggle, which means that we do not have to deal with a large number of concurrent users attempting to write to the database, making SQLite suitable as well.

## Approach

Node.js does not have a fixed architecture for organising files, giving us the flexibility to design according to our needs.

High level breakdown of file organisation:

- boggle

  - index
  - boggle API
  - database
  - game

## boggle/index.js

This will be the entry point. All backend server related code goes here.

## boggle/boggleAPI

The API routes can technically be lumped together with the server code. However, I separated them due to separation of concerns and extensibility (in the event that the server has to provide other end points for non-boggle related features).

## boggle/database

All database related code goes here - initialization, connection and read/write/update/delete operations.

## boggle/game

Each route will call a high-level method from boggle/game/index.js. All error handling and logic will be done here. Utility methods used to abstract the game logic will be placed separately in another utility file.

## Testing Approach

I only did manual testing via playing using Postman, no test code was written. Tested scenarios are listed below with their respective message that was sent back in the response.

- (POST) Create the Game

  - correct ID in URI, all parameters given

    - duration, random=true
    - duration, random=false, no custom board
    - duration, random=false, custom board

  - correct ID in URI, missing parameters -- (message: 'Required parameters missing.')
    - missing duration
    - missing random

- (PUT) Play the Game

  - correct ID in URI, all parameters given
    - valid token, correct & legal word, not expired
  - correct ID in URI, invalid word given -- (message: 'Invalid move/word given')

    - valid token, incorrect & legal word, not expired
    - valid token, correct & illegal word, not expired
    - valid token, incorrect & illegal word, not expired

  - correct ID in URI, invalid token given -- (message: 'Authentication failed. Incorrect token provided.')
  - correct ID, all parameters given, game expired -- (message: 'Game has expired')

  - correct ID in URI, missing parameters -- (message: 'Required parameters missing.')

    - missing token
    - missing word

  - incorrect ID in URI -- (message: 'Invalid ID provided. Game not exist.')

- (GET) Show the Game
  - correct ID in URI
  - incorrect ID in URI -- (message: 'Requested game not found.')

## Instructions

- Install node
- Install npm
- Install packages

  ```
  cd ./boggle
  npm install
  ```

- Create .env file using template provided at ./boggle/.env.template
- Start backend server

  ```
  cd ./boggle
  node index.js
  ```

- Play game via HTTP client (e.g Postman)

## Things to Note

As the assignment requires production quality code, I feel that there is a need to explain certain coding style/decisions.

For this, I loosely followed the AirBnb Javascript style guide.

Personally, I prefer to be more verbose when it comes to naming my variables. This is to allow the next developer to be able to get up to speed as fast as possible and reduce ambiguity of intepretation. As a result, the variable names may be longer than what most people usually use.

For the case of if-else vs ternary operators, I prefer to use the ternary operator only for simple logic situations. Otherwise, I prefer to use if-else for longer, nested blocks of logic (inserting comments where appropriate).

## Additional Information

There are some slight differences from the actual Boggle game.

- Points are awarded according to the length of the word, instead of the actual tiered Boggle scoring system.
- The PUT route for playing the game will return the accumulated score for that particular game, not the score for that word.
- There is no 'Qu' character in this version.
- There is a wildcard character denoted by '\*'.
