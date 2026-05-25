const canvas = document.getElementById("game"); // canvas hry
const ctx = canvas.getContext("2d"); // 2D kreslenie

// Zakaze CTRL + scroll zoom v prehliadaci
document.addEventListener("wheel", (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// Zakaze CTRL + PLUS/MINUS zoom
document.addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "+" || e.key === "-" || e.key === "=")
  ) {
    e.preventDefault();
  }
});

// MENU ELEMENTY
const menu = document.getElementById("menu");
const startBtn = document.getElementById("start");
const controlsBtn = document.getElementById("controls");
const closeBtn = document.getElementById("closeControls");
const overlay = document.getElementById("controlsOverlay");

// DEATH SCREEN
const deathScreen = document.getElementById("deathScreen");
const restartBtn = document.getElementById("restartBtn");

// WIN SCREEN
const winScreen = document.getElementById("winScreen");
const winRestartBtn = document.getElementById("winRestartBtn");
const winText = document.getElementById("winText");

// Vypne rozmazanie pixel artu
ctx.imageSmoothingEnabled = false;

// =====================================
// SETTINGS & GOALS
// =====================================

const TILE_SIZE = 16; // velkost jedneho tile


// Live Server = mensi zoom
var ZOOM = 5;

// Kolko coinov treba na vyhru
const COIN_GOAL = 1500;

// Specialne ID tileov
const ENEMY_TILE = 99; // enemy spawn
const HEAL_TILE = 98; // heal item
const TORCH_TILE = 97; // torch item

// Kolko HP heal item prida
const HEAL_AMOUNT = 50;

// Velkost mapy
const gridCols = 96;
const gridRows = 101;

// =====================================
// MAP
// =====================================
const mapRows = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 20, 8, 8, 8, 8, 8, 8, 8, 20, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 19, 6, 28, 29, 6, 6, 6, 6, 19, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 8, 20, 8, 8, 8, 14, 15, 8, 8, 20, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 21, 1, 30, 31, 1, 1, 1, 1, 21, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 6, 19, 6, 5, 6, 16, 17, 28, 29, 19, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 97, 97, 97, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 6, 21, 1, 1, 1, 4, 1, 30, 31, 21, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 98, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 22, 23, 24, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 18, 1, 1, 1, 22, 23, 24, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 25, 26, 24, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 5, 1, 1, 1, 25, 26, 27, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 6, 1, 1, 97, 1, 1, 1, 97, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 1, 1, 1, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 6, 6, 6, 6, 1, 1, 1, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 5, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 8, 20, 8, 8, 8, 8, 8, 8, 8, 8, 6, 1, 1, 1, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 20, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 6, 19, 18, 6, 6, 28, 29, 6, 6, 5, 6, 1, 1, 1, 6, 6, 5, 6, 6, 6, 6, 18, 6, 6, 19, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 6, 21, 1, 1, 1, 30, 31, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 21, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 22, 23, 24, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 22, 23, 24, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 6, 20, 8, 8, 8, 8, 8, 20, 6, 1, 1, 1, 1, 25, 26, 27, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 25, 26, 27, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 6, 19, 6, 6, 6, 6, 6, 19, 6, 1, 1, 1, 99, 1, 1, 1, 99, 1, 1, 1, 1, 1, 1, 1, 1, 99, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 5, 1, 1, 1, 1, 21, 1, 1, 1, 1, 1, 21, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 22, 23, 24, 1, 1, 1, 1, 99, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 25, 26, 27, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 22, 23, 24, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 99, 1, 1, 1, 1, 1, 1, 1, 99, 1, 1, 1, 99, 25, 26, 27, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 22, 23, 24, 1, 1, 1, 1, 1, 1, 99, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 25, 26, 27, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 1, 97, 1, 1, 1, 97, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 97, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 1, 1, 1, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 1, 1, 1, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 8, 20, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 20, 8, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 20, 8, 8, 8, 8, 6, 1, 1, 1, 6, 8, 8, 8, 8, 20, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 19, 6, 6, 6, 5, 6, 6, 6, 18, 6, 6, 19, 6, 0, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 19, 6, 6, 6, 6, 6, 1, 1, 1, 6, 6, 6, 6, 6, 19, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 21, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 21, 6, 0, 6, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 21, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 21, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 20, 6, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 19, 6, 1, 1, 1, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 21, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 97, 1, 1, 97, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 97, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 97, 6, 6, 6, 5, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 6, 6, 6, 5, 6, 18, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],


];

const map = mapRows.flat();
const originalMap = mapRows.flat();

const tileset = new Image(); // nacita tileset obrazok
tileset.src = "assets/tileset.png";

const enemyImg = new Image(); // textura enemies
enemyImg.src = "assets/TestEnemy.png";

const healImg = new Image(); // textura heal itemu
healImg.src = "assets/Kytek.png";

const playerFront = new Image();
playerFront.src = "assets/player.png";

const playerBack = new Image();
playerBack.src = "assets/LeonB.png";

const playerWalk1 = new Image();
playerWalk1.src = "assets/LeonFWalk1.png";

const playerWalk2 = new Image();
playerWalk2.src = "assets/LeonFWalk2.png";

const playerBackWalk1 = new Image();
playerBackWalk1.src = "assets/LeonBWalk1.png";

const playerBackWalk2 = new Image();
playerBackWalk2.src = "assets/LeonBWalk2.png";

const playerRightWalk1 = new Image();
playerRightWalk1.src = "assets/Leon Side1.png";

const playerRightWalk2 = new Image();
playerRightWalk2.src = "assets/Leon Side2.png";

const playerLeftWalk1 = new Image();
playerLeftWalk1.src = "assets/Leon LSide1.png";

const playerLeftWalk2 = new Image();
playerLeftWalk2.src = "assets/Leon LSide2.png";

const playerLeftIdle = new Image();
playerLeftIdle.src = "assets/Leon LSideIdle.png";

const playerRightIdle = new Image();
playerRightIdle.src = "assets/Leon RSideIdle.png";

let currentDirection = "front";


let currentPlayerSprite = playerFront;

let walkFrame = 0;
let walkTimer = 0;

const atlas = {
  floor_plain: { x: 32, y: 48, w: 16, h: 16 },
  corridor: { x: 32, y: 48, w: 16, h: 16 },
  loot: { x: 224, y: 176, w: 16, h: 16 },
  entrance: { x: 80, y: 32, w: 32, h: 16 },
  blocked: { x: 368, y: 16, w: 32, h: 32 },
  wall_center: { x: 16, y: 16, w: 16, h: 16 },
  wall_right: { x: 32, y: 16, w: 16, h: 16 },
  wall_top_center: { x: 16, y: 0, w: 16, h: 16 },
  wall_front: { x: 272, y: 16, w: 16, h: 16 },
  wall_outer_n: { x: 272, y: 0, w: 16, h: 16 },
  wall_outer_ne: { x: 288, y: 0, w: 16, h: 16 },
  wall_outer_nw: { x: 256, y: 0, w: 16, h: 16 },
  wall_outer_e: { x: 288, y: 16, w: 16, h: 16 },
  wall_windows: { x: 64, y: 48, w: 16, h: 16 },
  entrance_door1: { x: 367, y: 16, w: 16, h: 16 },
  entrance_door2: { x: 384, y: 16, w: 16, h: 16 },
  entrance_door3: { x: 367, y: 32, w: 16, h: 16 },
  entrance_door4: { x: 384, y: 32, w: 16, h: 16 },
  pipe_lower: { x: 48, y: 0, w: 16, h: 16 },
  lower_pillar: { x: 96, y: 64, w: 16, h: 16 },
  upper_pillar: { x: 96, y: 48, w: 16, h: 16 },
  floor_pillar: { x: 96, y: 80, w: 16, h: 16 },
  floor_stain1: { x: 7, y: 98, w: 16, h: 16 },
  floor_stain2: { x: 23, y: 98, w: 16, h: 16 },
  floor_stain3: { x: 39, y: 98, w: 16, h: 16 },
  floor_stain4: { x: 7, y: 114, w: 16, h: 16 },
  floor_stain5: { x: 23, y: 114, w: 16, h: 16 },
  floor_stain6: { x: 39, y: 114, w: 16, h: 16 },
  torch: { x: 128, y: 156, w: 16, h: 16 },
  blue_fountain1: { x: 192, y: 80, w: 16, h: 16 },
  blue_fountain2: { x: 208, y: 80, w: 16, h: 16 },
  blue_fountainsplash: { x: 192, y: 96, w: 16, h: 16 },
  blue_fountainsplash2: { x: 208, y: 96, w: 16, h: 16 },
 
  


};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.style.width = "100vw";
  canvas.style.height = "100vh";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function updateZoom() {
  if (window.innerWidth < 900) {
    ZOOM = 3;
  } else if (window.innerWidth < 1400) {
    ZOOM = 4;
  } else {
    ZOOM = 5;
  }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawAtlasTile(atlasX, atlasY, atlasW, atlasH, screenX, screenY, screenW, screenH) {
  ctx.drawImage(
    tileset,
    atlasX + 0.5,
    atlasY + 0.5,
    atlasW - 1,
    atlasH - 1,
    Math.round(screenX),
    Math.round(screenY),
    Math.round(screenW),
    Math.round(screenH)
  );
}

function getAtlasForTile(tile) {
  if (tile === 1) return atlas.floor_plain;
  if (tile === 2) return atlas.corridor;
  if (tile === 3) return atlas.floor_plain;
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
  if (tile === 18) return atlas.pipe_lower;
  if (tile === 19) return atlas.lower_pillar;
  if (tile === 20) return atlas.upper_pillar;
  if (tile === 21) return atlas.floor_pillar;
  if (tile === 22) return atlas.floor_stain1;
  if (tile === 23) return atlas.floor_stain2;
  if (tile === 24) return atlas.floor_stain3;
  if (tile === 25) return atlas.floor_stain4;
  if (tile === 26) return atlas.floor_stain5;
  if (tile === 27) return atlas.floor_stain6;
  if (tile === 28) return atlas.blue_fountain1;
  if (tile === 29) return atlas.blue_fountain2;
  if (tile === 30) return atlas.blue_fountainsplash;
  if (tile === 31) return atlas.blue_fountainsplash2;
  if (tile === ENEMY_TILE) return atlas.floor_plain;
  if (tile === HEAL_TILE) return atlas.floor_plain;
  if (tile === TORCH_TILE) return atlas.floor_plain;


  return null;
}

// ==========================
// PLAYER
// ==========================
const player = {
  x: 0,
  y: 0,
  width: 24,
  height: 24,
  speed: 1,
  hp: 100,
  maxHp: 100,
  pulseOffset: 0,
  attackDamage: 50,
  attackRange: 35,
  attackCooldown: 0
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

  player.x = 6 * TILE_SIZE;
  player.y = 5 * TILE_SIZE;
}

// ==========================
// COINS
// ==========================
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
  for (const coin of coins) {
    if (coin.collected) continue;

    if (
      player.x < coin.x + TILE_SIZE &&
      player.x + player.width > coin.x &&
      player.y < coin.y + TILE_SIZE &&
      player.y + player.height > coin.y
    ) {
      coin.collected = true;
      ptas += 500;

      if (ptas >= COIN_GOAL) {
        handleWin();
      }
    }
  }
}

function drawCoins() {
  for (const coin of coins) {
    if (coin.collected) continue;

    const a = atlas.loot;

    drawAtlasTile(
      a.x,
      a.y,
      a.w,
      a.h,
      Math.round((coin.x - camera.x) * ZOOM),
      Math.round((coin.y - camera.y) * ZOOM),
      TILE_SIZE * ZOOM + 1,
      TILE_SIZE * ZOOM + 1
    );
  }
}

let heals = [];

function initHeals() {
  heals = [];

  for (let row = 0; row < mapRows.length; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = mapRows[row][col];

      if (tile === HEAL_TILE) {
        heals.push({
          x: col * TILE_SIZE,
          y: row * TILE_SIZE,
          collected: false
        });
      }
    }
  }
}



function checkHealCollision() {

  if (herbPromptActive) return;

  for (const heal of heals) {

    if (heal.collected) continue;

    // ignore herb after ESC until player walks away
    if (heal === herbIgnore) {

      const stillTouching =
        player.x < heal.x + TILE_SIZE &&
        player.x + player.width > heal.x &&
        player.y < heal.y + TILE_SIZE &&
        player.y + player.height > heal.y;

      if (stillTouching) {
        continue;
      } else {
        herbIgnore = null;
      }
    }

    if (
      player.x < heal.x + TILE_SIZE &&
      player.x + player.width > heal.x &&
      player.y < heal.y + TILE_SIZE &&
      player.y + player.height > heal.y
    ) {

      herbPromptActive = true;
      currentHerb = heal;

      break;
    }
  }
}

function drawHeals() {
  for (const heal of heals) {
    if (heal.collected) continue;

    ctx.drawImage(
      healImg,
      Math.round((heal.x - camera.x) * ZOOM),
      Math.round((heal.y - camera.y) * ZOOM),
      TILE_SIZE * ZOOM,
      TILE_SIZE * ZOOM
    );
  }
}



let enemies = [];

function initEnemies() {
  enemies = [];

  for (let row = 0; row < mapRows.length; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = mapRows[row][col];

      if (tile === ENEMY_TILE) {
        enemies.push({
          x: col * TILE_SIZE,
          y: row * TILE_SIZE,
          width: 16,
          height: 16,
          speed: 0.4,
          hp: 100
        });
      }
    }
  }

  console.log("Enemies spawned:", enemies.length);
}

function updateEnemies() {
  if (!roomLocked) return;

  for (const enemy of enemies) {
    if (!enemyInLockedRoom(enemy)) continue;

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      const nextX = enemy.x + (dx / dist) * enemy.speed;
      const nextY = enemy.y + (dy / dist) * enemy.speed;

      if (isWalkable(nextX, enemy.y, enemy.width, enemy.height)) {
        enemy.x = nextX;
      }

      if (isWalkable(enemy.x, nextY, enemy.width, enemy.height)) {
        enemy.y = nextY;
      }
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const a = enemies[i];
      const b = enemies[j];

      if (!enemyInLockedRoom(a) || !enemyInLockedRoom(b)) continue;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = 18;

      if (dist > 0 && dist < minDist) {
        const overlap = minDist - dist;
        const pushX = (dx / dist) * overlap * 0.5;
        const pushY = (dy / dist) * overlap * 0.5;

        a.x -= pushX;
        a.y -= pushY;
        b.x += pushX;
        b.y += pushY;
      }
    }
  }
}

function attackEnemies() {
  if (player.attackCooldown > 0) return;

  for (const enemy of enemies) {
    const dx = enemy.x + enemy.width / 2 - (player.x + player.width / 2);
    const dy = enemy.y + enemy.height / 2 - (player.y + player.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= player.attackRange) {
      enemy.hp -= player.attackDamage;
    }
  }

  enemies = enemies.filter(enemy => enemy.hp > 0);
  player.attackCooldown = 25;
}

// enemy kolízie medzi sebou
for (let i = 0; i < enemies.length; i++) {
  for (let j = i + 1; j < enemies.length; j++) {
    const a = enemies[i];
    const b = enemies[j];

    if (!enemyInLockedRoom(a) || !enemyInLockedRoom(b)) continue;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const minDist = 18;

    if (dist > 0 && dist < minDist) {
      const overlap = minDist - dist;
      const pushX = (dx / dist) * overlap * 0.5;
      const pushY = (dy / dist) * overlap * 0.5;

      if (isWalkable(a.x - pushX, a.y, a.width, a.height)) {
        a.x -= pushX;
      }

      if (isWalkable(a.x, a.y - pushY, a.width, a.height)) {
        a.y -= pushY;
      }

      if (isWalkable(b.x + pushX, b.y, b.width, b.height)) {
        b.x += pushX;
      }

      if (isWalkable(b.x, b.y + pushY, b.width, b.height)) {
        b.y += pushY;
      }
    }
  }
}

function drawDecorations() {
  for (let row = 0; row < mapRows.length; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = map[row * gridCols + col];

      if (tile === TORCH_TILE) {
        const a = atlas.torch;

        drawAtlasTile(
          a.x,
          a.y,
          a.w,
          a.h,
          Math.round((col * TILE_SIZE - camera.x) * ZOOM),
          Math.round((row * TILE_SIZE - camera.y) * ZOOM),
          TILE_SIZE * ZOOM,
          TILE_SIZE * ZOOM
        );
      }
    }
  }
}

function drawEnemies() {
  for (const enemy of enemies) {
    ctx.drawImage(
      enemyImg,
      Math.round((enemy.x - camera.x) * ZOOM),
      Math.round((enemy.y - camera.y) * ZOOM),
      enemy.width * ZOOM,
      enemy.height * ZOOM
    );
  }
}

let roomLocked = false;
let doorsClosed = false;

const LOCK_DOOR_TILE = 6;

const lockedRoom = {
  x: 16,
  y: 13,
  w: 26,
  h: 16,

  doors: [
    { x: 16, y: 20 },
    { x: 16, y: 19 },
    { x: 16, y: 18 },
    { x: 20, y: 27 },
    { x: 21, y: 27 },
    { x: 19, y: 27 },
  ]
};

function isPlayerInLockedRoom() {
  const playerCol = Math.floor((player.x + player.width / 2) / TILE_SIZE);
  const playerRow = Math.floor((player.y + player.height / 2) / TILE_SIZE);

  // menšia trigger zóna vo vnútri miestnosti
  return (
    playerCol >= lockedRoom.x + 3 &&
    playerCol <= lockedRoom.x + lockedRoom.w - 3 &&
    playerRow >= lockedRoom.y + 3 &&
    playerRow <= lockedRoom.y + lockedRoom.h - 3
  );
}

function enemyInLockedRoom(enemy) {
  const enemyCol = Math.floor((enemy.x + enemy.width / 2) / TILE_SIZE);
  const enemyRow = Math.floor((enemy.y + enemy.height / 2) / TILE_SIZE);

  return (
    enemyCol >= lockedRoom.x &&
    enemyCol <= lockedRoom.x + lockedRoom.w &&
    enemyRow >= lockedRoom.y &&
    enemyRow <= lockedRoom.y + lockedRoom.h
  );
}

function enemiesInLockedRoomAlive() {
  return enemies.some(enemy => enemyInLockedRoom(enemy));
}

function closeRoomDoors() {
  if (doorsClosed) return;

  for (const door of lockedRoom.doors) {
    map[door.y * gridCols + door.x] = LOCK_DOOR_TILE;
  }

  doorsClosed = true;
}

function openRoomDoors() {
  for (const door of lockedRoom.doors) {
    map[door.y * gridCols + door.x] = 1;
  }

  doorsClosed = false;
}

function updateRoomLock() {
  if (!roomLocked && isPlayerInLockedRoom() && enemiesInLockedRoomAlive()) {
    roomLocked = true;
    closeRoomDoors();
  }

  if (roomLocked && !enemiesInLockedRoomAlive()) {
    roomLocked = false;
    openRoomDoors();
  }
}

// ==========================
// CAMERA
// ==========================
const camera = { x: 0, y: 0 };

function updateCamera() {
  const visibleWorldWidth = window.innerWidth / ZOOM;
  const visibleWorldHeight = window.innerHeight / ZOOM;

  camera.x = player.x + player.width / 2 - visibleWorldWidth / 2;
  camera.y = player.y + player.height / 2 - visibleWorldHeight / 2;

  const maxCameraX = gridCols * TILE_SIZE - visibleWorldWidth;
  const maxCameraY = mapRows.length * TILE_SIZE - visibleWorldHeight;

  camera.x = Math.max(0, Math.min(camera.x, maxCameraX));
  camera.y = Math.max(0, Math.min(camera.y, maxCameraY));

  camera.x = Math.round(camera.x);
  camera.y = Math.round(camera.y);
}

// ==========================
// COLLISION
// ==========================
function getTile(x, y) {
  if (x < 0 || x >= gridCols || y < 0 || y >= mapRows.length) return 0;
  return map[y * gridCols + x];
}

function isSolidTile(tile) {
  return tile === 0 || (tile == 5 || tile === 6 || tile === 8 || tile === 14 || tile === 15 || tile === 16 || tile === 17 || tile === 18 || tile === 19 || tile === 20);
}

function isWalkable(x, y, width, height) {
  const hitbox = {
    x: x + 4,
    y: y + 4,
    width: width - 8,
    height: height - 8
  };

  const left = Math.floor(hitbox.x / TILE_SIZE);
  const right = Math.floor((hitbox.x + hitbox.width - 1) / TILE_SIZE);
  const top = Math.floor(hitbox.y / TILE_SIZE);
  const bottom = Math.floor((hitbox.y + hitbox.height - 1) / TILE_SIZE);

  if (left < 0 || right >= gridCols || top < 0 || bottom >= mapRows.length) {
    return false;
  }

  const corners = [
    getTile(left, top),
    getTile(right, top),
    getTile(left, bottom),
    getTile(right, bottom)
  ];

  return !corners.some(isSolidTile);
}

// ==========================
// DRAW
// ==========================
function drawMap() {
  const camX = Math.round(camera.x);
  const camY = Math.round(camera.y);
  for (let row = 0; row < mapRows.length; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = map[row * gridCols + col];
      if (tile === 0) continue;

      const atlasTile = getAtlasForTile(tile);
      if (!atlasTile) continue;

      drawAtlasTile(
        atlasTile.x,
        atlasTile.y,
        atlasTile.w,
        atlasTile.h,
        Math.round((col * TILE_SIZE - camX) * ZOOM),
        Math.round((row * TILE_SIZE - camY) * ZOOM),
        TILE_SIZE * ZOOM + 1,
        TILE_SIZE * ZOOM + 1
      );
    }
  }
}

function drawUI() {
  const centerX = window.innerWidth - 120;
  const centerY = window.innerHeight - 120;
  const radius = 45;
  const healthPercent = Math.max(0, player.hp / player.maxHp);

  let color = "#3de391";
  let statusText = "FINE";
  let pulseSpeed = 0.08;

  if (healthPercent < 0.6) {
    color = "#f2cc0d";
    statusText = "CAUTION";
    pulseSpeed = 0.15;
  }

  if (healthPercent < 0.25) {
    color = "#ff3b3b";
    statusText = "DANGER";
    pulseSpeed = 0.3;
  }

  if (healthPercent <= 0) {
    color = "#777";
    statusText = "DEAD";
    pulseSpeed = 0;
  }

  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.shadowBlur = 12;
  ctx.shadowColor = color;

  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    radius + 2,
    -Math.PI / 2,
    -Math.PI / 2 + Math.PI * 2 * healthPercent
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.shadowBlur = 0;

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
      if (time > 0 && time < 0.4) {
        y -= Math.sin(time * (Math.PI / 0.4)) * 15;
      } else if (time >= 0.4 && time < 0.6) {
        y += Math.sin((time - 0.4) * (Math.PI / 0.2)) * 8;
      }
    }

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = "italic bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(statusText, centerX, centerY + 28);

  ctx.fillStyle = "#f2cc0d";
  ctx.font = "italic bold 22px serif";
  ctx.textAlign = "right";
  ctx.fillText(ptas + " / " + COIN_GOAL + " PTAS", window.innerWidth - 40, 50);

  ctx.restore();
}

function drawHerbPopup() {

  if (!herbPromptActive) return;

  const boxWidth = 500;
  const boxHeight = 160;

  const x = window.innerWidth / 2 - boxWidth / 2;
  const y = window.innerHeight - 240;

  // dark background
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(x, y, boxWidth, boxHeight);

  // border
  ctx.strokeStyle = "#d8c38f";
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, boxWidth, boxHeight);

  // title
  ctx.fillStyle = "#d8c38f";
  ctx.font = "bold 28px serif";
  ctx.textAlign = "center";
  ctx.fillText("You found a Gherb.", x + boxWidth / 2, y + 50);

  // controls
  ctx.font = "20px serif";
  ctx.fillText(
    "ENTER = Consume",
    x + boxWidth / 2,
    y + 105
  );

  // heal text
  ctx.fillStyle = "#6dff8a";
  ctx.font = "18px serif";
  ctx.fillText(
    "+" + HEAL_AMOUNT + " HP",
    x + boxWidth / 2,
    y + 135
  );
}

// ==========================
// GAME STATE
// ==========================
let gameRunning = false;
let animationId = null;
let deathSequenceTriggered = false;
let winSequenceTriggered = false;
let herbPromptActive = false;
let currentHerb = null;
let herbIgnore = null;

const keys = {};

let attackPressed = false;

window.addEventListener("keydown", (e) => {

  keys[e.key] = true;

  // HERB POPUP CONTROLS
  if (herbPromptActive) {

    // ENTER = consume
    if (e.key === "Enter") {

      if (currentHerb && !currentHerb.collected) {

        currentHerb.collected = true;

        player.hp = Math.min(
          player.maxHp,
          player.hp + HEAL_AMOUNT
        );
      }

      herbPromptActive = false;
      currentHerb = null;
    }

    // ESC = decline
    if (e.key === "Escape") {

      herbIgnore = currentHerb;

      herbPromptActive = false;
      currentHerb = null;
    }
  }

});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;

});



// ==========================
// WIN / DEATH
// ==========================
function handleDeath() {
  if (deathSequenceTriggered || winSequenceTriggered) return;

  deathSequenceTriggered = true;
  gameRunning = false;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (deathScreen) {
    deathScreen.style.display = "flex";

    setTimeout(() => {
      deathScreen.style.opacity = 1;

      const deathText = document.getElementById("deathText");

      if (deathText) {
        deathText.style.opacity = 1;
        deathText.style.transform = "scale(1)";
        deathText.style.transition = "all 2s ease-out";
      }
    }, 50);
  }

  setTimeout(() => {
    if (restartBtn) restartBtn.style.display = "block";
  }, 2000);
}

function handleWin() {
  if (winSequenceTriggered || deathSequenceTriggered) return;

  winSequenceTriggered = true;
  gameRunning = false;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (winScreen) {
    winScreen.style.display = "flex";

    setTimeout(() => {
      winScreen.style.opacity = 1;

      if (winText) {
        winText.style.opacity = 1;
        winText.style.transform = "scale(1)";
        winText.style.transition = "all 1s ease-out";
      }
    }, 100);
  }

  setTimeout(() => {
    if (winRestartBtn) winRestartBtn.style.display = "block";
  }, 2000);
}

// ==========================
// Restart Game
// ==========================

function restartGame() {

  for (let i = 0; i < map.length; i++) {
    map[i] = originalMap[i];
  }

  roomLocked = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  clearKeys();

  deathSequenceTriggered = false;
  winSequenceTriggered = false;
  gameRunning = false;

  if (deathScreen) {
    deathScreen.style.display = "none";
    deathScreen.style.opacity = 0;
  }

  if (winScreen) {
    winScreen.style.display = "none";
    winScreen.style.opacity = 0;
  }

  if (winText) {
    winText.style.opacity = 0;
    winText.style.transform = "scale(0.8)";
  }

  if (restartBtn) restartBtn.style.display = "none";
  if (winRestartBtn) winRestartBtn.style.display = "none";

  ptas = 0;
  initCoins();


  player.hp = player.maxHp;
  initEnemies();
  spawnPlayer();
  updateEnemies();
  updateCamera();
  initCoins();
  initHeals();
  initEnemies();


  gameRunning = true;
  gameLoop();
  roomLocked = false;
  doorsClosed = false;
  openRoomDoors();


}

if (restartBtn) restartBtn.addEventListener("click", restartGame);
if (winRestartBtn) winRestartBtn.addEventListener("click", restartGame);

function collidesWithEnemy(x, y, width, height) {
  for (const enemy of enemies) {
    if (
      x < enemy.x + enemy.width &&
      x + width > enemy.x &&
      y < enemy.y + enemy.height &&
      y + height > enemy.y
    ) {
      return true;
    }
  }

  return false;
}

// ==========================
// UPDATE
// ==========================
function update() {
  if (herbPromptActive) {
    updateCamera();
    return;
  }
  if (player.hp <= 0 || winSequenceTriggered) return;

  let currentSpeed = player.speed;

  if (collidesWithEnemy(player.x, player.y, player.width, player.height)) {
    currentSpeed = player.speed * 0.7;
    player.hp -= 0.3; // damage keď si v enemy
  }

  let nextX = player.x;
  let nextY = player.y;

  if (keys["w"] || keys["ArrowUp"]) {
    nextY -= currentSpeed;
    currentDirection = "back";
  }

  if (keys["s"] || keys["ArrowDown"]) {
    nextY += currentSpeed;
    currentDirection = "front";
  }

  if (keys["a"] || keys["ArrowLeft"]) {
    nextX -= currentSpeed;
    currentDirection = "left";
  }

  if (keys["d"] || keys["ArrowRight"]) {
    nextX += currentSpeed;
    currentDirection = "right";
  }

  if (keys["-"]) player.hp -= 1;
  if (keys["+"]) player.hp = Math.min(player.maxHp, player.hp + 1);

  if (isWalkable(nextX, player.y, player.width, player.height)) {
    player.x = nextX;
  }

  if (isWalkable(player.x, nextY, player.width, player.height)) {
    player.y = nextY;
  }

  // =====================================
  // PLAYER WALK ANIMATION
  // =====================================

  const moving =
    keys["w"] ||
    keys["ArrowUp"] ||
    keys["a"] ||
    keys["ArrowLeft"] ||
    keys["s"] ||
    keys["ArrowDown"] ||
    keys["d"] ||
    keys["ArrowRight"];

  if (moving) {
    walkTimer++;

    if (walkTimer >= 25) {
      walkTimer = 0;
      walkFrame++;

      if (walkFrame > 1) {
        walkFrame = 0;
      }
    }

    if (currentDirection === "front") {
      currentPlayerSprite = walkFrame === 0 ? playerWalk1 : playerWalk2;

    } else if (currentDirection === "back") {
      currentPlayerSprite = walkFrame === 0 ? playerBackWalk1 : playerBackWalk2;

    } else if (currentDirection === "right") {
      currentPlayerSprite = walkFrame === 0 ? playerRightWalk1 : playerRightWalk2;

    } else if (currentDirection === "left") {
      currentPlayerSprite = walkFrame === 0 ? playerLeftWalk1 : playerLeftWalk2;
    }

  } else {
    walkTimer = 0;
    walkFrame = 0;

    if (currentDirection === "front") {
      currentPlayerSprite = playerFront;

    } else if (currentDirection === "back") {
      currentPlayerSprite = playerBack;

    } else if (currentDirection === "right") {
      currentPlayerSprite = playerRightIdle;

    } else if (currentDirection === "left") {
      currentPlayerSprite = playerLeftIdle;
    }
  }

  if ((keys[" "] || keys["Spacebar"]) && !attackPressed && player.attackCooldown <= 0) {
    attackPressed = true;
    attackEnemies();
  }

  if (!(keys[" "] || keys["Spacebar"])) {
    attackPressed = false;
  }

  if (player.attackCooldown > 0) {
    player.attackCooldown--;
  }





  checkCoinCollision();
  checkHealCollision();
  updateRoomLock();
  updateEnemies();


  if (player.hp <= 0) {
    player.hp = 0;
    handleDeath();
  }

  updateCamera();
}
// ==========================
// GAME LOOP
// ==========================
function gameLoop() {
  if (!gameRunning) return;

  update();

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  drawMap();
  drawCoins();
  drawHeals();
  drawEnemies();
  drawDecorations();

  ctx.save();

  const drawW = player.width * ZOOM;
  const drawH = player.height * ZOOM;

  const screenX = Math.round((player.x - camera.x) * ZOOM);
  const screenY = Math.round((player.y - camera.y) * ZOOM);

  ctx.translate(screenX + drawW / 2, screenY + drawH / 2);

  if (player.hp <= 0) {
    ctx.rotate(Math.PI / 2);
  }

  ctx.drawImage(currentPlayerSprite, -drawW / 2, -drawH / 2, drawW, drawH);

  ctx.restore();

  drawUI();
  drawHerbPopup();

  animationId = requestAnimationFrame(gameLoop);
}

// ==========================
// START
// ==========================
function clearKeys() {
  for (let key in keys) {
    keys[key] = false;
  }
}

function startGame() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  clearKeys();

  if (menu) menu.style.display = "none";
  canvas.style.display = "block";

  ptas = 0;
  initCoins();
  initEnemies();
  initCoins();
  initHeals();
  initEnemies();



  player.hp = player.maxHp;


  spawnPlayer();
  updateCamera();

  gameRunning = true;

  Promise.all([
    new Promise((res) => {
      if (playerFront.complete) res();
      else playerFront.onload = res;
    }),
    new Promise((res) => {
      if (playerWalk1.complete) res();
      else playerWalk1.onload = res;
    }),
    new Promise((res) => {
      if (playerWalk2.complete) res();
      else playerWalk2.onload = res;
    }),
    new Promise((res) => {
      if (playerBackWalk1.complete) res();
      else playerBackWalk1.onload = res;
    }),
    new Promise((res) => {
      if (playerBackWalk2.complete) res();
      else playerBackWalk2.onload = res;
    }),
    new Promise((res) => {
      if (playerBack.complete) res();
      else playerBack.onload = res;
    }),
    new Promise((res) => {
      if (playerRightWalk1.complete) res();
      else playerRightWalk1.onload = res;
    }),
    new Promise((res) => {
      if (playerRightWalk2.complete) res();
      else playerRightWalk2.onload = res;
    }),
    new Promise((res) => {
      if (playerLeftWalk1.complete) res();
      else playerLeftWalk1.onload = res;
    }),
    new Promise((res) => {
      if (playerLeftWalk2.complete) res();
      else playerLeftWalk2.onload = res;
    }),
    new Promise((res) => {
      if (playerRightIdle.complete) res();
      else playerRightIdle.onload = res;
    }),
    new Promise((res) => {
      if (playerLeftIdle.complete) res();
      else playerLeftIdle.onload = res;
    }),
  ]).then(() => {
    gameLoop();
  });
}

if (startBtn) startBtn.addEventListener("click", startGame);

if (controlsBtn) {
  controlsBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });
}