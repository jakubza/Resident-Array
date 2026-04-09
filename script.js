const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const controlsBtn = document.getElementById('controls');
const closeBtn = document.getElementById('closeControls');
const overlay = document.getElementById('controlsOverlay');

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

let gameRunning = false;

function startGame() {
  document.getElementById("menu").style.display = "none";

  canvas.style.display = "block";

  gameRunning = true;
  gameLoop();
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(100, 100, 50, 50);

  requestAnimationFrame(gameLoop);
}
function on() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }