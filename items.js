// =====================================
// ITEMS.JS – coins, heals, exit door
// =====================================

import {
    mapRows, gridCols, TILE_SIZE, map,
    atlas, drawAtlasTile,
    EXIT_DOOR_CLOSED_1, EXIT_DOOR_CLOSED_2, EXIT_DOOR_CLOSED_3, EXIT_DOOR_CLOSED_4,
    EXIT_DOOR_OPEN_1, EXIT_DOOR_OPEN_2, EXIT_DOOR_OPEN_3, EXIT_DOOR_OPEN_4,
    HEAL_TILE,
} from "./map.js";
import { player } from "./player.js";
import { camera } from "./map.js";

export const COIN_GOAL = 1000;
export const HEAL_AMOUNT = 50;

// ── COINS ─────────────────────────────
export let coins = [];
export let ptas = 0;

export function resetPtas() { ptas = 0; }

export function initCoins() {
    coins = [];
    for (let row = 0; row < mapRows.length; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (mapRows[row][col] === 3)
                coins.push({ x: col * TILE_SIZE, y: row * TILE_SIZE, collected: false });
        }
    }
}

export function checkCoinCollision(onGoalReached) {
    for (const coin of coins) {
        if (coin.collected) continue;
        if (player.x < coin.x + TILE_SIZE && player.x + player.width > coin.x &&
            player.y < coin.y + TILE_SIZE && player.y + player.height > coin.y) {
            coin.collected = true;
            ptas += 500;
            if (ptas >= COIN_GOAL) onGoalReached();
        }
    }
}

export function drawCoins(ctx, ZOOM) {
    const a = atlas.loot;
    for (const coin of coins) {
        if (coin.collected) continue;
        drawAtlasTile(ctx, a.x, a.y, a.w, a.h,
            (coin.x - camera.x) * ZOOM,
            (coin.y - camera.y) * ZOOM,
            TILE_SIZE * ZOOM + 1, TILE_SIZE * ZOOM + 1);
    }
}

// ── HEALS ─────────────────────────────
export let heals = [];

const healImg = new Image();
healImg.src = "./assets/Kytek.png";

// stav bylinky
export let herbPromptActive = false;
export let currentHerb = null;
export let herbIgnore = null;

export function setHerbState(active, herb, ignore) {
    herbPromptActive = active;
    currentHerb = herb !== undefined ? herb : currentHerb;
    herbIgnore = ignore !== undefined ? ignore : herbIgnore;
}

export function initHeals() {
    heals = [];
    for (let row = 0; row < mapRows.length; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (mapRows[row][col] === HEAL_TILE)
                heals.push({ x: col * TILE_SIZE, y: row * TILE_SIZE, collected: false });
        }
    }
}

export function checkHealCollision() {
    if (herbPromptActive) return;

    for (const heal of heals) {
        if (heal.collected) continue;

        if (heal === herbIgnore) {
            const still = player.x < heal.x + TILE_SIZE && player.x + player.width > heal.x &&
                player.y < heal.y + TILE_SIZE && player.y + player.height > heal.y;
            if (still) continue;
            else herbIgnore = null;
        }

        if (player.x < heal.x + TILE_SIZE && player.x + player.width > heal.x &&
            player.y < heal.y + TILE_SIZE && player.y + player.height > heal.y) {
            herbPromptActive = true;
            currentHerb = heal;
            break;
        }
    }
}

export function drawHeals(ctx, ZOOM) {
    for (const heal of heals) {
        if (heal.collected) continue;
        ctx.drawImage(healImg,
            Math.round((heal.x - camera.x) * ZOOM),
            Math.round((heal.y - camera.y) * ZOOM),
            TILE_SIZE * ZOOM, TILE_SIZE * ZOOM);
    }
}

// ── EXIT DOOR ─────────────────────────
export const exitDoor = { x: 60, y: 45, opened: false };

export function placeClosedExitDoor() {
    const { x, y } = exitDoor;
    map[y * gridCols + x] = EXIT_DOOR_CLOSED_1;
    map[y * gridCols + (x + 1)] = EXIT_DOOR_CLOSED_2;
    map[(y + 1) * gridCols + x] = EXIT_DOOR_CLOSED_3;
    map[(y + 1) * gridCols + (x + 1)] = EXIT_DOOR_CLOSED_4;
    exitDoor.opened = false;
    console.log("EXIT DOOR SPAWNED");
}

export function openExitDoor() {
    if (exitDoor.opened) return;
    const { x, y } = exitDoor;
    map[y * gridCols + x] = EXIT_DOOR_OPEN_1;
    map[y * gridCols + (x + 1)] = EXIT_DOOR_OPEN_2;
    map[(y + 1) * gridCols + x] = EXIT_DOOR_OPEN_3;
    map[(y + 1) * gridCols + (x + 1)] = EXIT_DOOR_OPEN_4;
    exitDoor.opened = true;
}

export function checkExitDoorCollision(onWin) {
    if (!exitDoor.opened) return;
    const doorX = exitDoor.x * TILE_SIZE;
    const doorY = exitDoor.y * TILE_SIZE;
    if (player.x < doorX + TILE_SIZE * 2 && player.x + player.width > doorX &&
        player.y < doorY + TILE_SIZE * 2 && player.y + player.height > doorY) {
        onWin();
    }
}