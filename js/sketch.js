// Original: Daniel Shiffman, Upgraded: Ronald Wilson
// Snakes and Ladders

// What is the state?
const ROLL_STATE = 0; // Rolling the die
const MOVE_STATE = 1; // Moving to next spot
const SNADDER_STATE = 2; // Moving along a Snake or Ladder
let state = ROLL_STATE;

// Array of tiles
let tiles = [];
// One player
let player;

// Unecessary for playing the game
// these variables or for storing all the rolls over time
let rolls = [];
let index = 0;
let averageRolls = 0;
let avgP;

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

  avgP = createP('');

  rolls[index] = 0;

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
}

function draw() {
    frameRate(1);
//  background(51);

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

  // Rolling the die
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
  player.show();

  // Is the game over?
  if (player.spot >= tiles.length - 1) {
    soundFinish.setVolume(1.0);
    soundFinish.play();
    state = ROLL_STATE;
    player.reset();
    index++;
    rolls[index] = 0;
  }

  // Compute average rolls to complete game
  let sum = 0;
  for (let i = 0; i < rolls.length - 1; i++) {
    sum += rolls[i];
  }
  let avg = sum / (rolls.length - 1);
  if (avg) {
    avgP.html(avg);
  }
}
