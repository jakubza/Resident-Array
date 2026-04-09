const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const controlsBtn = document.getElementById('controls');
const closeBtn = document.getElementById('closeControls');
const overlay = document.getElementById('controlsOverlay');

ctx.imageSmoothingEnabled = false;

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
playerImg.src = "assets/Leon Kennedy.png";

// PLAYER
const player = {
  x: 100,
  y: 100,
  width: 128,
  height: 128,
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
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // hráč
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