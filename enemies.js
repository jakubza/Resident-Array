// =====================================
// ENEMIES.JS – nepriatelia, AI, locked room
// =====================================

import { mapRows, gridCols, TILE_SIZE, map, isWalkable } from "./map.js";
import { player } from "./player.js";

const enemyImg = new Image();
enemyImg.src = "./assets/TestEnemy.png";

export let enemies = [];

// ── SPAWN ─────────────────────────────
export const ENEMY_TILE = 99;

export function initEnemies() {
    enemies = [];
    for (let row = 0; row < mapRows.length; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (mapRows[row][col] === ENEMY_TILE) {
                enemies.push({ x: col * TILE_SIZE, y: row * TILE_SIZE, width: 16, height: 16, speed: 0.4, hp: 100 });
            }
        }
    }
    console.log("Enemies spawned:", enemies.length);
}

// ── LOCKED ROOM ───────────────────────
export const lockedRoom = {
    x: 16, y: 13, w: 26, h: 16,
    doors: [
        { x: 16, y: 20 }, { x: 16, y: 19 }, { x: 16, y: 18 },
        { x: 20, y: 27 }, { x: 21, y: 27 }, { x: 19, y: 27 },
    ],
};

const LOCK_DOOR_TILE = 6;
let roomLocked = false;
let doorsClosed = false;

export function isRoomLocked() { return roomLocked; }
export function isDoorsClosed() { return doorsClosed; }

export function enemyInLockedRoom(enemy) {
    const col = Math.floor((enemy.x + enemy.width / 2) / TILE_SIZE);
    const row = Math.floor((enemy.y + enemy.height / 2) / TILE_SIZE);
    return col >= lockedRoom.x && col <= lockedRoom.x + lockedRoom.w &&
        row >= lockedRoom.y && row <= lockedRoom.y + lockedRoom.h;
}

export function isPlayerInLockedRoom() {
    const col = Math.floor((player.x + player.width / 2) / TILE_SIZE);
    const row = Math.floor((player.y + player.height / 2) / TILE_SIZE);
    return col >= lockedRoom.x + 3 && col <= lockedRoom.x + lockedRoom.w - 3 &&
        row >= lockedRoom.y + 3 && row <= lockedRoom.y + lockedRoom.h - 3;
}

export function enemiesInLockedRoomAlive() {
    return enemies.some(enemyInLockedRoom);
}

function closeRoomDoors() {
    if (doorsClosed) return;
    for (const door of lockedRoom.doors) map[door.y * gridCols + door.x] = LOCK_DOOR_TILE;
    doorsClosed = true;
}

export function openRoomDoors() {
    for (const door of lockedRoom.doors) map[door.y * gridCols + door.x] = 1;
    doorsClosed = false;
}

export function resetRoomLock() {
    roomLocked = false;
    doorsClosed = false;
}

export function updateRoomLock() {
    if (!roomLocked && isPlayerInLockedRoom() && enemiesInLockedRoomAlive()) {
        roomLocked = true;
        closeRoomDoors();
    }
    if (roomLocked && !enemiesInLockedRoomAlive()) {
        roomLocked = false;
        openRoomDoors();
    }
}

// ── AI & KOLÍZIA ─────────────────────
export function updateEnemies() {
    if (!roomLocked) return;

    for (const enemy of enemies) {
        if (!enemyInLockedRoom(enemy)) continue;
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            if (isWalkable(enemy.x + (dx / dist) * enemy.speed, enemy.y, enemy.width, enemy.height))
                enemy.x += (dx / dist) * enemy.speed;
            if (isWalkable(enemy.x, enemy.y + (dy / dist) * enemy.speed, enemy.width, enemy.height))
                enemy.y += (dy / dist) * enemy.speed;
        }
    }

    // Odpudzovanie medzi nepriateľmi
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const a = enemies[i]; const b = enemies[j];
            if (!enemyInLockedRoom(a) || !enemyInLockedRoom(b)) continue;
            const dx = b.x - a.x; const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = 18;
            if (dist > 0 && dist < minDist) {
                const overlap = minDist - dist;
                const px = (dx / dist) * overlap * 0.5;
                const py = (dy / dist) * overlap * 0.5;
                a.x -= px; a.y -= py;
                b.x += px; b.y += py;
            }
        }
    }
}

// ── ÚTOK ─────────────────────────────
export function attackEnemies() {
    if (player.attackCooldown > 0) return;
    for (const enemy of enemies) {
        const dx = enemy.x + enemy.width / 2 - (player.x + player.width / 2);
        const dy = enemy.y + enemy.height / 2 - (player.y + player.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) <= player.attackRange) enemy.hp -= player.attackDamage;
    }
    enemies.splice(0, enemies.length, ...enemies.filter(e => e.hp > 0));
    player.attackCooldown = 25;
}

// ── KOLÍZIA S HRÁČOM ─────────────────
export function collidesWithEnemy(x, y, width, height) {
    return enemies.some(e =>
        x < e.x + e.width && x + width > e.x &&
        y < e.y + e.height && y + height > e.y
    );
}

// ── KRESLENIE ─────────────────────────
export function drawEnemies(ctx, camera, ZOOM) {
    for (const enemy of enemies) {
        ctx.drawImage(enemyImg,
            Math.round((enemy.x - camera.x) * ZOOM),
            Math.round((enemy.y - camera.y) * ZOOM),
            enemy.width * ZOOM, enemy.height * ZOOM);
    }
}