// =====================================
// MAIN.JS – game loop, štart, restart, input, death/win
// =====================================

import { camera, updateCamera, drawMap, drawDecorations, drawFog, map, originalMap, gridCols } from "./map.js";
import { player, spawnPlayer, updatePlayer, drawPlayer, allSprites } from "./player.js";
// OPRAVA: Pridali sme drawEnemies priamo do hlavného importu hore
import {
    enemies, initEnemies, updateEnemies, attackEnemies, collidesWithEnemy,
    updateRoomLock, openRoomDoors, resetRoomLock, drawEnemies, clearDeadEnemies,
} from "./enemies.js";
import {
    coins, ptas, resetPtas, initCoins, checkCoinCollision, drawCoins,
    heals, initHeals, checkHealCollision, drawHeals,
    exitDoor, placeClosedExitDoor, openExitDoor, checkExitDoorCollision,
    herbPromptActive, currentHerb, herbIgnore,
    setHerbState, HEAL_AMOUNT,
} from "./items.js";
import { drawUI, drawHerbPopup } from "./ui.js";
import { allEnemySprites } from "./enemies.js";
import { drawDeadEnemies } from "./enemies.js";


// ── CANVAS ────────────────────────────
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Zakáže CTRL + scroll/klávesnicový zoom v prehliadači
document.addEventListener("wheel", (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && ["+", "-", "="].includes(e.key)) e.preventDefault();
});

// ── ZOOM ──────────────────────────────
let ZOOM = 5;
function updateZoom() {
    ZOOM = window.innerWidth < 900 ? 3 : window.innerWidth < 1400 ? 4 : 5;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    updateZoom();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ── MENU ELEMENTY ─────────────────────
const menu = document.getElementById("menu");
const startBtn = document.getElementById("start");
const controlsBtn = document.getElementById("controls");
const closeBtn = document.getElementById("closeControls");
const overlay = document.getElementById("controlsOverlay");
const deathScreen = document.getElementById("deathScreen");
const restartBtn = document.getElementById("restartBtn");
const winScreen = document.getElementById("winScreen");
const winRestartBtn = document.getElementById("winRestartBtn");
const winText = document.getElementById("winText");

// ── GAME STATE ────────────────────────
let gameRunning = false;
let animationId = null;
let deathSequenceTriggered = false;
let winSequenceTriggered = false;

const keys = {};

// ── INPUT ─────────────────────────────
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    // Bylinka popup
    if (herbPromptActive) {
        if (e.key === "Enter" && currentHerb && !currentHerb.collected) {
            currentHerb.collected = true;
            player.hp = Math.min(player.maxHp, player.hp + HEAL_AMOUNT);
            setHerbState(false, null, null);
        }
        if (e.key === "Escape") {
            setHerbState(false, null, currentHerb); // herbIgnore = currentHerb
        }
    }
});
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

function clearKeys() { for (const k in keys) keys[k] = false; }

// ── DEATH / WIN ───────────────────────
function handleDeath() {
    if (deathSequenceTriggered || winSequenceTriggered) return;
    deathSequenceTriggered = true;
    gameRunning = false;
    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }

    if (deathScreen) {
        deathScreen.style.display = "flex";
        setTimeout(() => {
            deathScreen.style.opacity = 1;
            const dt = document.getElementById("deathText");
            if (dt) { dt.style.opacity = 1; dt.style.transform = "scale(1)"; dt.style.transition = "all 2s ease-out"; }
        }, 50);
    }
    setTimeout(() => { if (restartBtn) restartBtn.style.display = "block"; }, 2000);
}

function handleWin() {
    if (winSequenceTriggered || deathSequenceTriggered) return;
    winSequenceTriggered = true;
    gameRunning = false;
    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }

    if (winScreen) {
        winScreen.style.display = "flex";
        setTimeout(() => {
            winScreen.style.opacity = 1;
            if (winText) { winText.style.opacity = 1; winText.style.transform = "scale(1)"; winText.style.transition = "all 1s ease-out"; }
        }, 100);
    }
    setTimeout(() => { if (winRestartBtn) winRestartBtn.style.display = "block"; }, 2000);
}

// ── RESTART ───────────────────────────
function restartGame() {
    for (let i = 0; i < map.length; i++) map[i] = originalMap[i];

    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    clearKeys();

    deathSequenceTriggered = false;
    winSequenceTriggered = false;
    gameRunning = false;

    if (deathScreen) { deathScreen.style.display = "none"; deathScreen.style.opacity = 0; }
    if (winScreen) { winScreen.style.display = "none"; winScreen.style.opacity = 0; }
    if (winText) { winText.style.opacity = 0; winText.style.transform = "scale(0.8)"; }
    if (restartBtn) restartBtn.style.display = "none";
    if (winRestartBtn) winRestartBtn.style.display = "none";

    resetPtas();
    player.hp = player.maxHp;
    resetRoomLock();
    openRoomDoors();

    initCoins();
    initHeals();
    clearDeadEnemies();
    initEnemies();
    placeClosedExitDoor();
    spawnPlayer();
    updateCamera(player, ZOOM);

    gameRunning = true;
    gameLoop();
}

// ── UPDATE ────────────────────────────
function update() {
    if (herbPromptActive) { updateCamera(player, ZOOM); return; }
    if (player.hp <= 0 || winSequenceTriggered) return;

    updatePlayer(keys, enemies, attackEnemies, collidesWithEnemy);

    checkCoinCollision(() => openExitDoor());
    checkHealCollision();
    updateRoomLock();
    updateEnemies();
    checkExitDoorCollision(() => handleWin());

    if (player.hp <= 0) { player.hp = 0; handleDeath(); }

    updateCamera(player, ZOOM);
}

// ── GAME LOOP ─────────────────────────
function gameLoop() {
    if (!gameRunning) return;

    update();

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    drawMap(ctx, ZOOM);
    drawCoins(ctx, ZOOM);
    drawHeals(ctx, ZOOM);

    // OPRAVA: Odstránený pomalý dynamic import, teraz voláme funkciu priamo a rýchlo
    drawEnemies(ctx, camera, ZOOM);
    drawDeadEnemies(ctx, camera, ZOOM);
    drawFog(ctx, ZOOM, player);
    drawDecorations(ctx, ZOOM);
    drawPlayer(ctx, camera, ZOOM);
    drawUI(ctx);
    drawHerbPopup(ctx, herbPromptActive);

    animationId = requestAnimationFrame(gameLoop);
}

// ── ŠTART ─────────────────────────────
function startGame() {
    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    clearKeys();

    if (menu) menu.style.display = "none";
    canvas.style.display = "block";

    resetPtas();
    player.hp = player.maxHp;

    initCoins();
    initHeals();
    initEnemies();
    placeClosedExitDoor();
    spawnPlayer();
    updateCamera(player, ZOOM);

    gameRunning = true;

    Promise.all(
        [...allSprites, ...allEnemySprites].map(img =>
            new Promise(res => {
                if (img.complete) res();
                else img.onload = res;
            })
        )
    ).then(() => gameLoop());
}

// ── EVENT LISTENERY ───────────────────
if (startBtn) startBtn.addEventListener("click", startGame);
if (restartBtn) restartBtn.addEventListener("click", restartGame);
if (winRestartBtn) winRestartBtn.addEventListener("click", restartGame);
if (controlsBtn) controlsBtn.addEventListener("click", () => { overlay.style.display = "flex"; });
if (closeBtn) closeBtn.addEventListener("click", () => { overlay.style.display = "none"; });