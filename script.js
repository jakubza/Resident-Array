const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const controlsBtn = document.getElementById("controls");
const closeBtn = document.getElementById("closeControls");
const overlay = document.getElementById("controlsOverlay");

// New Death Screen Elements
const deathScreen = document.getElementById("deathScreen");
const restartBtn = document.getElementById("restartBtn");

ctx.imageSmoothingEnabled = false;

// =====================================
// FULLSCREEN CANVAS
// =====================================
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =====================================
// SETTINGS
// =====================================
const TILE_SIZE = 16;
const ZOOM = 4;

const gridCols = 96;
const gridRows = 64;

// =====================================
// MAPA
// =====================================
const mapRows = [
  "000000000000000000000000000006666666666660000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000061111111111111111111111111100000000000000000000000000000000000000000",
  "000000000000000000000000000061111111111111111111111111100000000000000000000000000000000000000000",
  "000000000000000000000000000061116666666666000011111111100000000000000000000000000000000000000000",
  "088888888888888880000000000061116000000000000011111111111111111000000000000000000000000000000000",
  "066666666666666660000000666661116666600000000011111111111111111000000000000000000000000000000000",
  "061111111111111168888888611111111111600000000011111111111111111000000000000000000000000000000000",
  "061111111111111166666666611111111111600000000011111111111111111000000000000000000000000000000000",
  "061111111111111111111111111111111111600000000011111111111111111000000000000000000000000000000000",
  "061111111111111111111111111111111111600000000011111111111111111000000000000000000000000000000000",
  "061111111111111111111111111111111111600000000000000011100000000000000000000000000000000000000000",
  "061111111111111166666666611111111111600000000000000011100000000000000000000000000000000000000000",
  "061111111111111160000000611111111111600000000000000011100000000000000000000000000000000000000000",
  "061111111111111160000000666661416666600000000000000011100000000000000000000000000000000000000000",
  "061111111111111160000000000061116000000000000000000011100000000000000000000000000000000000000000",
  "066666661166666660000000000066566000000000000000000011100000000000000000000000000000000000000000",
  "000000001100000000000000000000000000000000000000000011100000000000000000000000000000000000000000",
  "000000001100000000000000000000000000000000000111111111111111110000000000000000000000000000000000",
  "000001111111100000000000000000000000000000000111111111111111110000000000000000000000000000000000",
  "000001111111100000000000000000000000000000000111111111111111110000000000000000000000000000000000",
  "000001111111100000000000000000000000000000000111111111111111110000000000000000000000000000000000",
  "000001111111100000000000000000000000000000000111111111111111110000000000000000000000000000000000",
  "000001111111100000000000000000000000000000000111111111111111110000000000000000000000000000000000",
  "000001111111100000000000000000000000000000000111111111111111110000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    
];

const map = mapRows.join("").split("").map(Number);

// =====================================
// TEXTURES
// =====================================
const tileset = new Image();
tileset.src = "assets/tileset.png";

const playerImg = new Image();
playerImg.src = "assets/player.png";

const atlas = {
  floor_plain: { x: 33.5,  y: 48,  w: 14, h: 16 },
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
};

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
  if (tile === 5) return atlas.blocked;
  if (tile === 6) return atlas.wall_center;
  if (tile === 7) return atlas.wall_right;
  if (tile === 8) return atlas.wall_top_center;
  if (tile === 9) return atlas.wall_front;
  if (tile === 10) return atlas.wall_outer_n;
  if (tile === 1) return atlas.wall_outer_ne;
  if (tile === 12) return atlas.wall_outer_nw;
  if (tile === 13) return atlas.wall_outer_e;
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
  speed: 1,
  hp: 100,
  maxHp: 100
};

function spawnPlayer() {
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = map[row * gridCols + col];
      if (tile === 4) {
        player.x = col * TILE_SIZE;
        player.y = row * TILE_SIZE;
        return;
      }
    }
  }
  player.x = 24 * TILE_SIZE;
  player.y = 28 * TILE_SIZE;
}

spawnPlayer();

// =====================================
// INPUT
// =====================================
const keys = {};

window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

// =====================================
// CAMERA
// =====================================
const camera = { x: 0, y: 0 };

function updateCamera() {
  const visibleWorldWidth = canvas.width / ZOOM;
  const visibleWorldHeight = canvas.height / ZOOM;

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
  if (x < 0 || x >= gridCols || y < 0 || y >= gridRows) return 0;
  return map[y * gridCols + x];
}

function isSolidTile(tile) {
  return tile === 0 || tile === 5 || tile === 6 || tile === 7;
}

function isWalkable(x, y, width, height) {
  const hitbox = { x: x + 2, y: y + 2, width: width - 4, height: height - 4 };
  const left = Math.floor(hitbox.x / TILE_SIZE);
  const right = Math.floor((hitbox.x + hitbox.width - 1) / TILE_SIZE);
  const top = Math.floor(hitbox.y / TILE_SIZE);
  const bottom = Math.floor((hitbox.y + hitbox.height - 1) / TILE_SIZE);

  if (left < 0 || right >= gridCols || top < 0 || bottom >= gridRows) return false;

  const corners = [
    getTile(left, top),
    getTile(right, top),
    getTile(left, bottom),
    getTile(right, bottom)
  ];
  return !corners.some(isSolidTile);
}



// =====================================
// UI & MAP RENDERING
// =====================================
function drawMap() {
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const tile = map[row * gridCols + col];
      if (tile === 0) continue;
      const atlasTile = getAtlasForTile(tile);
      if (!atlasTile) continue;

      drawAtlasTile(
        atlasTile.x, atlasTile.y, atlasTile.w, atlasTile.h,
        (col * TILE_SIZE - camera.x) * ZOOM,
        (row * TILE_SIZE - camera.y) * ZOOM,
        TILE_SIZE * ZOOM, TILE_SIZE * ZOOM
      );
    }
  }
}

function drawUI() {
  const barWidth = 200;
  const barHeight = 20;
  const padding = 20;
  const healthPercent = Math.max(0, player.hp / player.maxHp);

  ctx.fillStyle = "#330000";
  ctx.fillRect(padding, padding, barWidth, barHeight);

  ctx.fillStyle = healthPercent > 0.3 ? "#00ff00" : "#ff0000";
  ctx.fillRect(padding, padding, barWidth * healthPercent, barHeight);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(padding, padding, barWidth, barHeight);

  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`HP: ${Math.ceil(player.hp)} / ${player.maxHp}`, padding + barWidth/2, padding + 15);
}

// =====================================
// DEATH
// =====================================
function handleDeath() {
  gameRunning = false;
  if (deathScreen) deathScreen.style.display = "flex";
}

function restartGame() {
  player.hp = player.maxHp;
  spawnPlayer();
  if (deathScreen) deathScreen.style.display = "none";
  updateCamera();
  gameRunning = true;
  gameLoop();
}

if (restartBtn) restartBtn.addEventListener("click", restartGame);

function update() {
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

  if (player.hp <= 0) {
    player.hp = 0;
    handleDeath();
  }

  updateCamera();
}

// =====================================
// GAME LOOP
// =====================================
let gameRunning = false;

function gameLoop() {
  if (!gameRunning) return;

  update();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();

  ctx.drawImage(
    playerImg,
    (player.x - camera.x) * ZOOM,
    (player.y - camera.y) * ZOOM,
    player.width * ZOOM,
    player.height * ZOOM
  );

  drawUI();

  requestAnimationFrame(gameLoop);
}

// =====================================
// START GAME
// =====================================
function startGame() {
  if (menu) menu.style.display = "none";
  canvas.style.display = "block";
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