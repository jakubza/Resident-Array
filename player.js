// =====================================
// PLAYER.JS – hráč, pohyb, animácie, útok
// =====================================

import { isWalkable } from "./map.js";

// ── SPRITES ───────────────────────────
const load = (src) => { const i = new Image(); i.src = src; return i; };

export const sprites = {
    front: load("assets/player.png"),
    back: load("assets/LeonB.png"),
    walk1: load("assets/LeonFWalk1.png"),
    walk2: load("assets/LeonFWalk2.png"),
    backWalk1: load("assets/LeonBWalk1.png"),
    backWalk2: load("assets/LeonBWalk2.png"),
    rightWalk1: load("assets/Leon Side1.png"),
    rightWalk2: load("assets/Leon Side2.png"),
    leftWalk1: load("assets/Leon LSide1.png"),
    leftWalk2: load("assets/Leon LSide2.png"),
    leftIdle: load("assets/Leon LSideIdle.png"),
    rightIdle: load("assets/Leon RSideIdle.png"),
};

const slashImg = new Image();
slashImg.src = "./assets/Slash.png";


export const allSprites = Object.values(sprites);

// ── PLAYER OBJEKT ─────────────────────
export const player = {
    x: 0, y: 0,
    width: 24, height: 24,
    speed: 1,
    hp: 100, maxHp: 100,
    pulseOffset: 0,
    attackDamage: 40,
    attackRange: 37,
    attackCooldown: 5,
};

// ── ANIMÁCIA ──────────────────────────
let currentDirection = "front";
let currentSprite = sprites.front;
let walkFrame = 0;
let walkTimer = 0;

export function getCurrentSprite() { return currentSprite; }
export function getCurrentDirection() { return currentDirection; }

function pickSprite(moving) {
    if (!moving) {
        const idle = { front: sprites.front, back: sprites.back, right: sprites.rightIdle, left: sprites.leftIdle };
        currentSprite = idle[currentDirection];
        return;
    }
    const walk = {
        front: [sprites.walk1, sprites.walk2],
        back: [sprites.backWalk1, sprites.backWalk2],
        right: [sprites.rightWalk1, sprites.rightWalk2],
        left: [sprites.leftWalk1, sprites.leftWalk2],
    };
    currentSprite = walk[currentDirection][walkFrame];
}

// ── SPAWN ─────────────────────────────
import { mapRows, gridCols, TILE_SIZE } from "./map.js";

export function spawnPlayer() {
    for (let row = 0; row < mapRows.length; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (mapRows[row][col] === 4) {
                player.x = col * TILE_SIZE;
                player.y = row * TILE_SIZE;
                return;
            }
        }
    }
    player.x = 6 * TILE_SIZE;
    player.y = 5 * TILE_SIZE;
}

// ── UPDATE ────────────────────────────
let attackPressed = false;

let slashActive = false;
let slashTimer = 0;
const SLASH_DURATION = 8;

export function startSlash() {
    slashActive = true;
    slashTimer = SLASH_DURATION;
}

export function updatePlayer(keys, enemies, attackEnemiesFn, collidesWithEnemy) {
    let speed = player.speed;

    if (collidesWithEnemy(player.x, player.y, player.width, player.height)) {
        speed *= 0.5;
        player.hp -= 0.1;
    }

    let nextX = player.x;
    let nextY = player.y;

    if (keys["w"] || keys["ArrowUp"]) { nextY -= speed; currentDirection = "back"; }
    if (keys["s"] || keys["ArrowDown"]) { nextY += speed; currentDirection = "front"; }
    if (keys["a"] || keys["ArrowLeft"]) { nextX -= speed; currentDirection = "left"; }
    if (keys["d"] || keys["ArrowRight"]) { nextX += speed; currentDirection = "right"; }

    // Debug HP 
    //if (keys["-"]) player.hp -= 1;
    //if (keys["+"]) player.hp = Math.min(player.maxHp, player.hp + 1);

    if (isWalkable(nextX, player.y, player.width, player.height)) player.x = nextX;
    if (isWalkable(player.x, nextY, player.width, player.height)) player.y = nextY;

    // ── Animácia ──
    const moving = keys["w"] || keys["ArrowUp"] || keys["s"] || keys["ArrowDown"] ||
        keys["a"] || keys["ArrowLeft"] || keys["d"] || keys["ArrowRight"];

    if (moving) {
        walkTimer++;
        if (walkTimer >= 25) { walkTimer = 0; walkFrame = walkFrame > 0 ? 0 : 1; }
    } else {
        walkTimer = 0; walkFrame = 0;
    }
    pickSprite(moving);

    // ÚTOK
    const attackKey = keys[" "] || keys["Spacebar"];

    if (attackKey && !attackPressed && player.attackCooldown <= 0) {
        attackPressed = true;

        attackEnemiesFn();
        startSlash();

        player.attackCooldown = 100;
    }

    if (!attackKey) {
        attackPressed = false;
    }

    // Odpocitavanie cooldownu slash animacie
    if (player.attackCooldown > 0) {
        player.attackCooldown--;
    }

    // Miznuca slash animacia
    if (slashActive) {
        slashTimer--;

        if (slashTimer <= 0) {
            slashActive = false;
        }
    }
}


// ── KRESLENIE ─────────────────────────
export function drawPlayer(ctx, camera, ZOOM) {
    const drawW = player.width * ZOOM;
    const drawH = player.height * ZOOM;
    const screenX = Math.round((player.x - camera.x) * ZOOM);
    const screenY = Math.round((player.y - camera.y) * ZOOM);

    ctx.save();
    ctx.translate(screenX + drawW / 2, screenY + drawH / 2);
    if (player.hp <= 0) ctx.rotate(Math.PI / 2);
    ctx.drawImage(getCurrentSprite(), -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
}

export function drawSlash(ctx, camera, ZOOM) {
    if (!slashActive) return;

    const size = 24 * ZOOM;

    let offsetX = 0;
    let offsetY = 0;
    let rotation = 0;

    if (currentDirection === "front") {
        offsetY = 18 * ZOOM;
        rotation = 0;
    }

    if (currentDirection === "back") {
        offsetY = -14 * ZOOM;
        rotation = Math.PI;
    }

    if (currentDirection === "right") {
        offsetX = 18 * ZOOM;
        rotation = -Math.PI / 2;
    }

    if (currentDirection === "left") {
        offsetX = -18 * ZOOM;
        rotation = Math.PI / 2;
    }

    const x = Math.round((player.x - camera.x + player.width / 2) * ZOOM);
    const y = Math.round((player.y - camera.y + player.height / 2) * ZOOM);

    ctx.save();
    ctx.translate(x + offsetX, y + offsetY);
    ctx.rotate(rotation);
    ctx.globalAlpha = slashTimer / SLASH_DURATION;
    ctx.drawImage(slashImg, -size / 2, -size / 2, size, size);
    ctx.restore();
}