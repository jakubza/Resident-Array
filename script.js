const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("start");
const controlsBtn = document.getElementById("controls");
const closeBtn = document.getElementById("closeControls");
const overlay = document.getElementById("controlsOverlay");

const deathScreen = document.getElementById("deathScreen");
const restartBtn = document.getElementById("restartBtn");

// New Win Screen Elements
const winScreen = document.getElementById("winScreen");
const winRestartBtn = document.getElementById("winRestartBtn");
const winText = document.getElementById("winText");

ctx.imageSmoothingEnabled = false;

// =====================================
// SETTINGS & GOALS
// =====================================
const TILE_SIZE = 16;
const ZOOM = 5;
const COIN_GOAL = 500; // Goal: Collect 5 coins (500 each)

const gridCols = 96;
const gridRows = 64;

// =====================================
// MAP
// =====================================
const mapRows = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,14,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,6,6,5,16,17,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,6,1,1,1,4,1,1,1,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,6,1,1,1,1,1,1,1,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,6,1,1,1,1,1,1,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,6,1,1,1,1,1,1,1,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,6,1,1,1,1,1,1,1,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,6,6,6,1,1,1,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,1,1,1,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,6,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,6,0,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,6,6,6,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      
  ];
  
  const map = mapRows.flat();

// =====================================
// TEXTURES
// =====================================
const tileset = new Image();
tileset.src = "assets/tileset.png";

const playerImg = new Image();
playerImg.src = "assets/player.png";

const atlas = {
  floor_plain: { x: 32,  y: 48,  w: 16, h: 16 },
  corridor:    { x: 32,  y: 48,  w: 16, h: 16 },
  loot:        { x: 224, y: 176, w: 16, h: 16 },
  entrance:    { x: 80,  y: 32,  w: 32, h: 16 },
  blocked:     { x: 368, y: 16,  w: 32, h: 32 },
  wall_center:  { x: 16,  y: 16,  w: 16, h: 16 }, 
  wall_right: { x: 32,  y: 16,  w: 16, h: 16 },
  wall_top_center: { x: 16,  y: 0,   w: 16, h: 16 },
  wall_front: { x: 272, y: 16,  w: 32, h: 32 },
  wall_outer_n: { x: 272, y: 0,  w: 16, h: 16 },
  wall_outer_ne: { x: 288, y: 0,  w: 16, h: 16 },
  wall_outer_nw: { x: 256, y: 0,  w: 16, h: 16 },
  wall_outer_e: { x: 288, y: 16, w: 16, h: 16 },
  wall_windows: { x: 64, y: 48, w: 16, h: 16 },
  entrance_door1: { x: 367, y: 16, w: 16, h: 16 },
  entrance_door2: { x: 384, y: 16, w: 16, h: 16 },
  entrance_door3: { x: 367, y: 32, w: 16, h: 16 },
  entrance_door4: { x: 384, y: 32, w: 16, h: 16 },
};

// =====================================
// FULLSCREEN CANVAS
// =====================================
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =====================================
// DRAW HELPERS
// =====================================
function drawAtlasTile(atlasX, atlasY, atlasW, atlasH, screenX, screenY, screenW, screenH) {
  ctx.drawImage(tileset, atlasX, atlasY, atlasW, atlasH, screenX, screenY, screenW, screenH);
}

function getAtlasForTile(tile) {
  if (tile === 1) return atlas.floor_plain;
  if (tile === 2) return atlas.corridor;
  if (tile === 3) return atlas.loot;
  if (tile === 4) return atlas.entrance;
  if (tile === 5) return atlas.wall_windows;
  if (tile === 6) return atlas.wall_center;
  if (tile === 7) return atlas.wall_right;
  if (tile === 8) return atlas.wall_top_center;
  if (tile === 9) return atlas.wall_front;
  if (tile === 10) return atlas.wall_outer_n;
  if (tile === 11) return atlas.wall_outer_ne;
  if (tile === 12) return atlas.wall_outer_nw;
  if (tile === 13) return atlas.wall_outer_e;
  if (tile === 14) return atlas.entrance_door1;
  if (tile === 15) return atlas.entrance_door2;
  if (tile === 16) return atlas.entrance_door3;
  if (tile === 17) return atlas.entrance_door4;
  return null;
}

// =====================================
// PLAYER
// =====================================
const player = {
  x: 0,
  y: 0,
  width: 24,
  height: 24,
  speed: 1.5,
  hp: 100,
  maxHp: 100,
  pulseOffset: 0
};

function spawnPlayer() {
  for (let row = 0; row < mapRows.length; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = map[row * gridCols + col];
      if (tile === 4) {
        player.x = col * TILE_SIZE;
        player.y = row * TILE_SIZE;
        return;
      }
    }
  }
}

// =====================================
// COINS & SCORE
// =====================================
let coins = [];
let ptas = 0; 

function initCoins() {
  coins = [];
  for (let row = 0; row < mapRows.length; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = map[row * gridCols + col];
      if (tile === 3) {
        coins.push({
          x: col * TILE_SIZE,
          y: row * TILE_SIZE,
          collected: false
        });
      }
    }
  }
}

function checkCoinCollision() {
  coins.forEach(coin => {
    if (!coin.collected) {
      if (
        player.x < coin.x + TILE_SIZE &&
        player.x + player.width > coin.x &&
        player.y < coin.y + TILE_SIZE &&
        player.y + player.height > coin.y
      ) {
        coin.collected = true;
        ptas += 500; 
        
        // Check for Win Condition
        if (ptas >= COIN_GOAL) {
            handleWin();
        }
      }
    }
  });
}

function drawCoins() {
  coins.forEach(coin => {
    if (!coin.collected) {
      const a = atlas.loot;
      drawAtlasTile(
        a.x, a.y, a.w, a.h,
        (coin.x - camera.x) * ZOOM,
        (coin.y - camera.y) * ZOOM,
        TILE_SIZE * ZOOM, TILE_SIZE * ZOOM
      );
    }
  });
}

// =====================================
// CAMERA
// =====================================
const camera = { x: 0, y: 0 };

function updateCamera() {
const visibleWorldWidth = window.innerWidth / ZOOM;
const visibleWorldHeight = window.innerHeight / ZOOM;

  camera.x = player.x + player.width / 2 - visibleWorldWidth / 2;
  camera.y = player.y + player.height / 2 - visibleWorldHeight / 2;

  const maxCameraX = gridCols * TILE_SIZE - visibleWorldWidth;
  const maxCameraY = gridRows * TILE_SIZE - visibleWorldHeight;

  camera.x = Math.max(0, Math.min(camera.x, maxCameraX));
  camera.y = Math.max(0, Math.min(camera.y, maxCameraY));
}

// =====================================
// COLLISION
// =====================================
function getTile(x, y) {
  if (x < 0 || x >= gridCols || y < 0 || y >= mapRows.length) return 0;
  return map[y * gridCols + x];
}

function isSolidTile(tile) {
  return tile === 0 || (tile >= 5 && tile <= 13);
}

function isWalkable(x, y, width, height) {
  const hitbox = { x: x + 4, y: y + 4, width: width - 8, height: height - 8 };
  const left = Math.floor(hitbox.x / TILE_SIZE);
  const right = Math.floor((hitbox.x + hitbox.width - 1) / TILE_SIZE);
  const top = Math.floor(hitbox.y / TILE_SIZE);
  const bottom = Math.floor((hitbox.y + hitbox.height - 1) / TILE_SIZE);

  if (left < 0 || right >= gridCols || top < 0 || bottom >= mapRows.length) return false;

  const corners = [
    getTile(left, top),
    getTile(right, top),
    getTile(left, bottom),
    getTile(right, bottom)
  ];
  return !corners.some(isSolidTile);
}

// =====================================
// RENDERING
// =====================================
function drawMap() {
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = map[row * gridCols + col];
      if (tile === 0) continue;

      const atlasTile = getAtlasForTile(tile);
      if (!atlasTile) continue;

      const screenX = Math.round((col * TILE_SIZE - camera.x) * ZOOM);
      const screenY = Math.round((row * TILE_SIZE - camera.y) * ZOOM);
      const screenSize = TILE_SIZE * ZOOM;

      drawAtlasTile(
        atlasTile.x,
        atlasTile.y,
        atlasTile.w,
        atlasTile.h,
        screenX,
        screenY,
        screenSize,
        screenSize
      );
    }
  }
}

function drawUI() {
  const centerX = canvas.width - 120;
  const centerY = canvas.height - 120;
  const radius = 45;
  const healthPercent = Math.max(0, player.hp / player.maxHp);

  let color = "#3de391"; 
  let statusText = "FINE";
  let pulseSpeed = 0.08;

  if (healthPercent < 0.6) { color = "#f2cc0d"; statusText = "CAUTION"; pulseSpeed = 0.15; }
  if (healthPercent < 0.25) { color = "#ff3b3b"; statusText = "DANGER"; pulseSpeed = 0.3; }
  if (healthPercent <= 0) { color = "#777"; statusText = "DEAD"; pulseSpeed = 0; }

  ctx.save();
  // Health Ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.shadowBlur = 12;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 2, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * healthPercent));
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Pulse Line
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  player.pulseOffset += pulseSpeed;
  const pulseWidth = 70;
  const startX = centerX - pulseWidth / 2;

  for (let i = 0; i < pulseWidth; i++) {
    const x = startX + i;
    const time = (player.pulseOffset + i * 0.15) % (Math.PI * 2);
    let y = centerY;
    if (healthPercent > 0) {
        if (time > 0 && time < 0.4) y -= Math.sin(time * (Math.PI / 0.4)) * 15;
        else if (time >= 0.4 && time < 0.6) y += Math.sin((time - 0.4) * (Math.PI / 0.2)) * 8;
    }
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Status Text
  ctx.fillStyle = color;
  ctx.font = "italic bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(statusText, centerX, centerY + 28);

  // PTAS Counter
  ctx.fillStyle = "#f2cc0d";
  ctx.font = "italic bold 22px serif";
  ctx.textAlign = "right";
  ctx.fillText(ptas + " / " + COIN_GOAL + " PTAS", canvas.width - 40, 50);

  ctx.restore();
}

// =====================================
// GAME STATES (WIN/LOSS)
// =====================================
let deathSequenceTriggered = false;
let winSequenceTriggered = false;

function handleDeath() {
  if (deathSequenceTriggered || winSequenceTriggered) return;
  deathSequenceTriggered = true;
  gameRunning = false; // Stop the loop logic

  // 1. Show the container
  deathScreen.style.display = "flex";

  // 2. We need a tiny delay so the browser notices the display change 
  // before we start the opacity transition
  setTimeout(() => {
    deathScreen.style.opacity = 1;
    
    // 3. Target the specific text and make it visible
    const deathText = document.getElementById("deathText");
    if (deathText) {
      deathText.style.opacity = 1;
      deathText.style.transform = "scale(1)";
      deathText.style.transition = "all 2s ease-out"; // Smooth fade & grow
    }
  }, 50);

  // 4. Show the button after the dramatic pause
  setTimeout(() => { 
    restartBtn.style.display = "block"; 
  }, 2000);
}

function handleWin() {
    if (winSequenceTriggered || deathSequenceTriggered) return;
    winSequenceTriggered = true;
    gameRunning = false;

    winScreen.style.display = "flex";
    setTimeout(() => {
        winScreen.style.opacity = 1;
        winText.style.opacity = 1;
        winText.style.transform = "scale(1)";
        winText.style.transition = "all 1s ease-out";
    }, 100);

    setTimeout(() => {
        winRestartBtn.style.display = "block";
    }, 2000);
}

function restartGame() {
  deathSequenceTriggered = false;
  winSequenceTriggered = false;
  deathScreen.style.display = "none";
  winScreen.style.display = "none";
  winText.style.opacity = 0;
  winText.style.transform = "scale(0.8)";

  ptas = 0;
  initCoins();
  player.hp = player.maxHp;
  spawnPlayer();
  updateCamera();
  gameRunning = true;
  gameLoop();
}

// Listeners
if (restartBtn) restartBtn.addEventListener("click", restartGame);
if (winRestartBtn) winRestartBtn.addEventListener("click", restartGame);


// =====================================
// CORE LOGIC
// =====================================
const keys = {};
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function update() {
  if (player.hp <= 0 || winSequenceTriggered) return;

  let nextX = player.x;
  let nextY = player.y;

  if (keys["w"] || keys["ArrowUp"]) nextY -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) nextY += player.speed;
  if (keys["a"] || keys["ArrowLeft"]) nextX -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) nextX += player.speed;

  // HP SYS. TEST - MANUAL
  if (keys["-"]) player.hp -= 1;
  if (keys["+"]) player.hp = Math.min(player.maxHp, player.hp + 1);

  if (isWalkable(nextX, player.y, player.width, player.height)) player.x = nextX;
  if (isWalkable(player.x, nextY, player.width, player.height)) player.y = nextY;

  checkCoinCollision();

  if (player.hp <= 0) {
    player.hp = 0;
    handleDeath();
  }
  updateCamera();
}

let gameRunning = false;
function gameLoop() {
  if (!gameRunning && !deathSequenceTriggered && !winSequenceTriggered) return;

  update();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawCoins();

  ctx.save();
  const drawW = player.width * ZOOM;
  const drawH = player.height * ZOOM;
  const screenX = (player.x - camera.x) * ZOOM;
  const screenY = (player.y - camera.y) * ZOOM;

  ctx.translate(screenX + drawW / 2, screenY + drawH / 2);
  if (player.hp <= 0) ctx.rotate(Math.PI / 2);
  ctx.drawImage(playerImg, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  drawUI();
  if (gameRunning) requestAnimationFrame(gameLoop);
}

function startGame() {
  if (menu) menu.style.display = "none";
  canvas.style.display = "block";
  ptas = 0;
  initCoins();
  spawnPlayer();
  updateCamera();
  gameRunning = true;

  Promise.all([
    new Promise(res => { tileset.onload = res; if(tileset.complete) res(); }),
    new Promise(res => { playerImg.onload = res; if(playerImg.complete) res(); })
  ]).then(() => {
    gameLoop();
  });
}

if (startBtn) startBtn.addEventListener("click", startGame);
if (controlsBtn) controlsBtn.addEventListener("click", () => overlay.style.display = "flex");
if (closeBtn) closeBtn.addEventListener("click", () => overlay.style.display = "none");