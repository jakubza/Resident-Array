/*
import './styles.css'
import { KeyInput } from "./src/keyinput";
*/




const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const controlsBtn = document.getElementById('controls');
const closeBtn = document.getElementById('closeControls');
const overlay = document.getElementById('controlsOverlay');

ctx.imageSmoothingEnabled = false;

const tileW = 40;
const tileH = 40;

const gridRows = 10;
const gridCols = 10;




/*
// pozadie
const map = [
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 0, 0, 0, 0,

]

const updateAll = () => {

  window.requestAnimationFrame(updateAll);
}

window.onload = () => {

  window.requestAnimationFrame(updateAll);
}

const drawMap = () => {
  for (let eachRow = 0; eachRow < gridRows; eachRow++) {
    for (let eachCol = 0; eachCol < gridCols; eachCol++) {

      let arrayIndex = eachRow * gridRows + eachCol;

      if (map[arrayIndex] === 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(tileW * eachCol, tileH * eachRow, tileW, tileH);
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(tileW * eachCol, tileH * eachRow, tileW, tileH);
      }

    }
  }
}; */

// MENU / OVERLAY
controlsBtn.addEventListener('click', () => {
  overlay.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == overlay) {
    overlay.style.display = 'none';
  }
});

// PLAYER IMAGE
const playerImg = new Image();
playerImg.src = "assets/player.png";

// PLAYER
const player = {
  x: 100,
  y: 100,
  width: 64,
  height: 64,
  speed: 3
};

// KLÁVESY
const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// GAME STATE
let gameRunning = false;

// START GAME
function startGame() {
  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";

  gameRunning = true;

  if (playerImg.complete) {
    gameLoop();
  } else {
    playerImg.onload = () => {
      gameLoop();
    };
  }
}

// UPDATE (POHYB)
function update() {
  if (keys["w"] || keys["ArrowUp"]) {
    player.y -= player.speed;
  }

  if (keys["s"] || keys["ArrowDown"]) {
    player.y += player.speed;
  }

  if (keys["a"] || keys["ArrowLeft"]) {
    player.x -= player.speed;
  }

  if (keys["d"] || keys["ArrowRight"]) {
    player.x += player.speed;
  }

  // hranice (aby nešiel mimo)
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

// GAME LOOP
function gameLoop() {
  if (!gameRunning) return;

  update();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // pozadie
  const map = [

  ]


  ctx.drawImage(
    playerImg,
    player.x,
    player.y,
    player.width,
    player.height
  );

  requestAnimationFrame(gameLoop);
}

// OVERLAY FUNKCIE
function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}