const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const controlsBtn = document.getElementById("controls");
const closeBtn = document.getElementById("closeControls");
const overlay = document.getElementById("controlsOverlay");

ctx.imageSmoothingEnabled = false;

controlsBtn.addEventListener("click", () => {
  overlay.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == overlay) {
    overlay.style.display = "none";
  }
});

const playerImg = new Image();
playerImg.src = "assets/Leon Kennedy.png";

const player = {
  x: 100,
  y: 100,
  width: 128,
  height: 128
};

let gameRunning = false;

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

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    playerImg,
    player.x,
    player.y,
    player.width,
    player.height
  );

  requestAnimationFrame(gameLoop);
}

function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}