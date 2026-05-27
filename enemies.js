// =====================================
// ENEMIES.JS – nepriatelia, AI, locked room
// =====================================

import { mapRows, gridCols, TILE_SIZE, map, isWalkable } from "./map.js";
import { player } from "./player.js";

const load = (src) => {
    const img = new Image();
    img.src = src;
    return img;
};

const enemyDead = new Image();
enemyDead.src = "assets/Villager Dead.png";

export const enemySprites = {
    frontIdle: load("assets/Villager F idle.png"),
    frontWalk1: load("assets/Villager FW1.png"),
    frontWalk2: load("assets/Villager FW2.png"),

    backIdle: load("assets/Villager B idle.png"),
    backWalk1: load("assets/Villager BW1.png"),
    backWalk2: load("assets/Villager BW2.png"),

    rightIdle: load("assets/Villager RS idle.png"),
    rightWalk1: load("assets/Villager RSW1.png"),
    rightWalk2: load("assets/Villager RSW2.png"),

    leftIdle: load("assets/Villager LS idle.png"),
    leftWalk1: load("assets/Villager LSW1.png"),
    leftWalk2: load("assets/Villager LSW2.png"),


};

export const allEnemySprites = Object.values(enemySprites);

export let enemies = [];
export let deadEnemies = [];

// ── SPAWN ─────────────────────────────
export const ENEMY_TILE = 99;

export function initEnemies() {
    enemies = [];
    for (let row = 0; row < mapRows.length; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (mapRows[row][col] === ENEMY_TILE) {
                enemies.push({
                    x: col * TILE_SIZE,
                    y: row * TILE_SIZE,
                    width: 24,
                    height: 24,
                    speed: 0.4,
                    hp: 100,

                    direction: "front",
                    moving: false,
                    walkFrame: 0,
                    walkTimer: 0,
                    currentSprite: enemySprites.frontIdle
                });
            }
        }
    }
    console.log("Enemies spawned:", enemies.length);
}

// ── LOCKED ROOM ───────────────────────
export const lockedRooms = [
    {
        id: 1,
        name: "Center big room",
        x: 18, y: 12, w: 26, h: 16,
        doors: [
            { x: 16, y: 18 },
            { x: 16, y: 19 },
            { x: 16, y: 20 },
            { x: 19, y: 27 },
            { x: 20, y: 27 },
            { x: 21, y: 27 },
            { x: 27, y: 13 },
            { x: 28, y: 13 },
            { x: 29, y: 13 },
            { x: 41, y: 19 },
            { x: 41, y: 20 },
            { x: 41, y: 21 },

        ],
    },

    {
        id: 2,
        name: "Right center room",
        x: 55, y: 14, w: 15, h: 14,
        doors: [
            { x: 59, y: 27 },
            { x: 60, y: 27 },
            { x: 61, y: 27 },
            { x: 59, y: 13 },
            { x: 60, y: 13 },
            { x: 61, y: 13 },
            { x: 53, y: 19 },
            { x: 53, y: 20 },
            { x: 53, y: 21 },
        ],
    },

    {
        id: 3,
        name: "Bottom left room",
        x: 0, y: 40, w: 15, h: 12,
        doors: [
            { x: 17, y: 36 },
            { x: 17, y: 37 },
            { x: 17, y: 38 },
            { x: 7, y: 47 },
            { x: 9, y: 47 },
        ],
    },

    {
        id: 4,
        name: "Bottom middle room",
        x: 43, y: 35, w: 26, h: 14,
        doors: [
            { x: 52, y: 38 },
            { x: 52, y: 39 },
            { x: 52, y: 40 },
            { x: 68, y: 38 },
            { x: 68, y: 39 },
            { x: 68, y: 40 },

        ],
    },

    {
        id: 5,
        name: "Bottom right room",
        x: 79, y: 31, w: 12, h: 17,
        doors: [
            { x: 75, y: 38 },
            { x: 75, y: 39 },
            { x: 75, y: 40 },
        ],
    }
];

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

function closeRoomDoors(room) {
    if (doorsClosed) return;

    for (const door of room.doors) {
        map[door.y * gridCols + door.x] = LOCK_DOOR_TILE;
    }

    doorsClosed = true;
}

export function openRoomDoors(room = activeRoom) {
    if (!room) return;

    for (const door of room.doors) {
        map[door.y * gridCols + door.x] = 1;
    }

    doorsClosed = false;
}


export function resetRoomLock() {
    roomLocked = false;
    doorsClosed = false;
}

export function updateRoomLock() {
    if (!roomLocked) {
        const room = getPlayerRoom();

        if (room && enemiesInRoomAlive(room)) {
            activeRoom = room;
            roomLocked = true;
            closeRoomDoors(activeRoom);
        }
    }

    if (roomLocked && activeRoom && !enemiesInRoomAlive(activeRoom)) {
        roomLocked = false;
        openRoomDoors(activeRoom);
        activeRoom = null;
    }
}

function updateEnemyAnimation(enemy) {
    if (enemy.moving) {
        enemy.walkTimer++;

        if (enemy.walkTimer >= 25) {
            enemy.walkTimer = 0;
            enemy.walkFrame = enemy.walkFrame === 0 ? 1 : 0;
        }

        if (enemy.direction === "front") {
            enemy.currentSprite = enemy.walkFrame === 0 ? enemySprites.frontWalk1 : enemySprites.frontWalk2;
        } else if (enemy.direction === "back") {
            enemy.currentSprite = enemy.walkFrame === 0 ? enemySprites.backWalk1 : enemySprites.backWalk2;
        } else if (enemy.direction === "right") {
            enemy.currentSprite = enemy.walkFrame === 0 ? enemySprites.rightWalk1 : enemySprites.rightWalk2;
        } else if (enemy.direction === "left") {
            enemy.currentSprite = enemy.walkFrame === 0 ? enemySprites.leftWalk1 : enemySprites.leftWalk2;
        }

    } else {
        enemy.walkTimer = 0;
        enemy.walkFrame = 0;

        if (enemy.direction === "front") {
            enemy.currentSprite = enemySprites.frontIdle;
        } else if (enemy.direction === "back") {
            enemy.currentSprite = enemySprites.backIdle;
        } else if (enemy.direction === "right") {
            enemy.currentSprite = enemySprites.rightIdle;
        } else if (enemy.direction === "left") {
            enemy.currentSprite = enemySprites.leftIdle;
        }
    }
}

// ── AI & KOLÍZIA ─────────────────────
export function updateEnemies() {
    if (!roomLocked || !activeRoom) return;



    for (const enemy of enemies) {
        if (!entityInRoom(enemy, activeRoom)) continue;
        enemy.moving = false;

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            if (Math.abs(dx) > Math.abs(dy)) {
                enemy.direction = dx > 0 ? "right" : "left";
            } else {
                enemy.direction = dy > 0 ? "front" : "back";
            }

            const nextX = enemy.x + (dx / dist) * enemy.speed;
            const nextY = enemy.y + (dy / dist) * enemy.speed;

            if (isWalkable(nextX, enemy.y, enemy.width, enemy.height)) {
                enemy.x = nextX;
                enemy.moving = true;
            }

            if (isWalkable(enemy.x, nextY, enemy.width, enemy.height)) {
                enemy.y = nextY;
                enemy.moving = true;
            }
        }

        updateEnemyAnimation(enemy);
    }

    // Odpudzovanie medzi nepriateľmi
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const a = enemies[i]; const b = enemies[j];
            if (!entityInRoom(a, activeRoom) || !entityInRoom(b, activeRoom)) continue;
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

        if (Math.sqrt(dx * dx + dy * dy) <= player.attackRange) {
            enemy.hp -= player.attackDamage;
        }
    }

    // SPAWN MRTVOL
    for (const enemy of enemies) {

        if (enemy.hp <= 0) {

            deadEnemies.push({
                x: enemy.x,
                y: enemy.y,
                width: enemy.width,
                height: enemy.height
            });
        }
    }

    // REMOVE DEAD ENEMIES
    enemies.splice(
        0,
        enemies.length,
        ...enemies.filter(e => e.hp > 0)
    );

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
        ctx.drawImage(
            enemy.currentSprite,
            Math.round((enemy.x - camera.x) * ZOOM),
            Math.round((enemy.y - camera.y) * ZOOM),
            enemy.width * ZOOM,
            enemy.height * ZOOM
        );
    }
}

export function drawDeadEnemies(ctx, camera, ZOOM) {

    for (const corpse of deadEnemies) {

        ctx.drawImage(
            enemyDead,
            Math.round((corpse.x - camera.x) * ZOOM),
            Math.round((corpse.y - camera.y) * ZOOM),
            corpse.width * ZOOM,
            corpse.height * ZOOM
        );
    }
}

export function clearDeadEnemies() {
    deadEnemies = [];
}

let activeRoom = null;

function entityInRoom(entity, room) {
    const col = Math.floor((entity.x + entity.width / 2) / TILE_SIZE);
    const row = Math.floor((entity.y + entity.height / 2) / TILE_SIZE);

    return (
        col >= room.x &&
        col <= room.x + room.w &&
        row >= room.y &&
        row <= room.y + room.h
    );
}

function getPlayerRoom() {
    return lockedRooms.find(room => entityInRoom(player, room)) || null;
}

function enemiesInRoomAlive(room) {
    return enemies.some(enemy => entityInRoom(enemy, room));
}