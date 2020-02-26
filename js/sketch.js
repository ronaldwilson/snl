// Original: Daniel Shiffman, Upgraded: Ronald Wilson
// Snakes and Ladders

// What is the state?
const ROLL_STATE = 0; // Rolling the die
const MOVE_STATE = 1; // Moving to next spot
const SNADDER_STATE = 2; // Moving along a Snake or Ladder
let state = ROLL_STATE;
let state1 = ROLL_STATE;
let toss   = 0;
const DELAY = 1000;

// Array of tiles
let tiles = [];
// One player
let player;
let player1;

// Unecessary for playing the game
// these variables or for storing all the rolls over time
let rolls = [];
let rolls1 = [];
let index = 0;
let index1 = 0;
//let averageRolls = 0;
//let avgP;

function preload() {
  soundFormats('wav');
  soundBg       = loadSound('assets/slaking_bg.wav');
  soundMove     = loadSound('assets/move.wav');
  soundClimb    = loadSound('assets/climb.wav');
  soundSwallow  = loadSound('assets/swallow.wav');
  soundFinish   = loadSound('assets/gameOver.wav');
}

function setup() {
  createCanvas(600, 600);

  let myDiv = createDiv('click to start audio');
  myDiv.position(0, 0);

  soundBg.setVolume(0.05);
  soundBg.loop(); //loop
  soundBg.play(); //play Bg

  // Start the audio context on a click/touch event
  userStartAudio().then(function() {
     myDiv.remove();
   });

  //avgP = createP('');

  rolls[index] = 0;
  rolls1[index1] = 0;


  // Size of tile, columns and rows
  let resolution = 60;
  let cols = width / resolution;
  let rows = height / resolution;

  // Create all the tiles from bottom to top
  let x = 0;
  let y = (rows - 1) * resolution;
  let dir = 1;
  for (let i = 0; i < cols * rows; i++) {
    let tile = new Tile(x, y, resolution, i, i + 1);
    tiles.push(tile);
    x = x + resolution * dir;
    // Move along a winding path up the rows
    if (x >= width || x <= -resolution) {
      dir *= -1;
      x += resolution * dir;
      y -= resolution;
    }
  }

  // Pick random Snakes
  for (let i = 0; i < 3; i++) {
    let index = floor(random(cols, tiles.length - 1));
    // -1 makes in a Snake (drop down a number of spots)
    tiles[index].snadder = -1 * floor(random(index % cols, index - 1));
  }

  // Pick random Ladders
  for (let i = 0; i < 3; i++) {
    let index = floor(random(0, tiles.length - cols));
    tiles[index].snadder = floor(
      random(cols - (index % cols), tiles.length - index - 1)
    );
  }

  // A new player
  player = new Player();
  player1 = new Player();
}

function draw() {
    background(0);
    frameRate(1);

  // Draw all the tiles, snakes, and ladders
  for (let tile of tiles) {
    tile.show();
  }
  for (let tile of tiles){
    tile.showNumber();
  }
  for (let tile of tiles) {
    tile.showSnadders();
  }


    if(toss == 0){

      setTimeout(function() {

        // Maintain PLayer 2 position
        player1.show(2);

        // Rolling the die player 1
        if (state === ROLL_STATE) {
          player.rollDie();
          rolls[index]++;
          if(!player.isSnadder()){
              player.showPreview();
          }
          state = MOVE_STATE;
          // Moving the player
        } else if (state === MOVE_STATE) {
          if (player.isSnadder()) {
            state = SNADDER_STATE;
            setTimeout(function(){ }, 5000);
          } else {
            soundMove.setVolume(1.0);
            soundMove.play();
            player.move();
            state = ROLL_STATE;
          }
          // Moving along a Snake or Ladder
        } else if (state === SNADDER_STATE) {
          soundClimb.setVolume(1.0);
          if(player.isSnake()){
            soundSwallow.play();
          }else{
            soundClimb.play();
          }
          player.moveSnadder();
          state = ROLL_STATE;
        }

        // Draw the player
        player.show(1);

        // Is the game over?
        if (player.spot >= tiles.length - 1) {
          soundFinish.setVolume(1.0);
          soundFinish.play();

          state = ROLL_STATE;
          player.reset();
          index++;
          rolls[index] = 0;

          state1 = ROLL_STATE;
          player1.reset();
          index1++;
          rolls1[index1] = 0;
          toss = 0;
        }

        if(player.roll === 1 || player.roll === 6 || player.isSnadder()){
          toss = 0;
        }else{
          toss = 1;
        }

      }, DELAY);

    }else{

      setTimeout(function() {
        // Maintain player 1 position
        player.show(1);

        // Rolling the die player 2
        if (state1 === ROLL_STATE) {
          player1.rollDie();
          rolls1[index1]++;
          if(!player1.isSnadder()){
            player1.showPreview();
          }
          state1 = MOVE_STATE;
          // Moving the player
        } else if (state1 === MOVE_STATE) {
          if (player1.isSnadder()) {
            state1 = SNADDER_STATE;
          } else {
            soundMove.setVolume(1.0);
            soundMove.play();
            player1.move();
            state1 = ROLL_STATE;
          }
          // Moving along a Snake or Ladder
        } else if (state1 === SNADDER_STATE) {
          soundClimb.setVolume(1.0);
          if(player1.isSnake()){
            soundSwallow.play();
          }else{
            soundClimb.play();
          }
          player1.moveSnadder();
          state1 = ROLL_STATE;
        }

        // Draw the player
        player1.show(2);

        // Is the game over?
        if (player1.spot >= tiles.length - 1) {
          soundFinish.setVolume(1.0);
          soundFinish.play();

          state1 = ROLL_STATE;
          player1.reset();
          index1++;
          rolls1[index1] = 0;

          state = ROLL_STATE;
          player.reset();
          index++;
          rolls[index] = 0;
          toss = 0;
        }

       if(player1.roll === 1 || player1.roll === 6 || player1.isSnadder()){
         toss = 1;
       }else{
         toss = 0;
       }

      }, DELAY);

    }


}
