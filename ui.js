// =====================================
// UI.JS – HUD, herb popup
// =====================================

import { player } from "./player.js";
import { ptas, COIN_GOAL, HEAL_AMOUNT } from "./items.js";

export function drawUI(ctx) {
    const centerX = window.innerWidth - 120;
    const centerY = window.innerHeight - 120;
    const radius = 45;
    const hp = Math.max(0, player.hp / player.maxHp);

    let color = "#3de391", statusText = "FINE", pulseSpeed = 0.08;
    if (hp < 0.6) { color = "#f2cc0d"; statusText = "CAUTION"; pulseSpeed = 0.15; }
    if (hp < 0.25) { color = "#ff3b3b"; statusText = "DANGER"; pulseSpeed = 0.3; }
    if (hp <= 0) { color = "#777"; statusText = "DEAD"; pulseSpeed = 0; }

    ctx.save();

    // Vonkajší kruh
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 6;
    ctx.stroke();

    // HP oblúk
    ctx.shadowBlur = 12; ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hp);
    ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();
    ctx.shadowBlur = 0;

    // Pulz čiara
    ctx.beginPath();
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    player.pulseOffset += pulseSpeed;
    const pulseWidth = 70;
    const startX = centerX - pulseWidth / 2;
    for (let i = 0; i < pulseWidth; i++) {
        const x = startX + i;
        const time = (player.pulseOffset + i * 0.15) % (Math.PI * 2);
        let y = centerY;
        if (hp > 0) {
            if (time > 0 && time < 0.4) y -= Math.sin(time * (Math.PI / 0.4)) * 15;
            else if (time >= 0.4 && time < 0.6) y += Math.sin((time - 0.4) * (Math.PI / 0.2)) * 8;
        }
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Status text
    ctx.fillStyle = color;
    ctx.font = "italic bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(statusText, centerX, centerY + 28);

    // PTAS counter
    ctx.fillStyle = "#f2cc0d";
    ctx.font = "italic bold 22px serif";
    ctx.textAlign = "right";
    ctx.fillText(ptas + " / " + COIN_GOAL + " PTAS", window.innerWidth - 40, 50);

    ctx.restore();
}

export function drawHerbPopup(ctx, herbPromptActive) {
    if (!herbPromptActive) return;

    const boxW = 500, boxH = 160;
    const x = window.innerWidth / 2 - boxW / 2;
    const y = window.innerHeight - 240;

    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(x, y, boxW, boxH);

    ctx.strokeStyle = "#d8c38f"; ctx.lineWidth = 4;
    ctx.strokeRect(x, y, boxW, boxH);

    ctx.fillStyle = "#d8c38f";
    ctx.font = "bold 28px serif"; ctx.textAlign = "center";
    ctx.fillText("You found a Green herb.", x + boxW / 2, y + 50);

    ctx.font = "20px serif";
    ctx.fillText("ENTER = Consume", x + boxW / 2, y + 105);

    ctx.fillStyle = "#6dff8a";
    ctx.font = "18px serif";
    ctx.fillText("+" + HEAL_AMOUNT + " HP", x + boxW / 2, y + 135);
}

export function drawObjective(ctx, objectiveText) {

    ctx.save();

    ctx.font = "italic bold 22px serif";
    ctx.fillStyle = "#f2cc0d";
    ctx.textAlign = "center";


    ctx.fillStyle = "#f2cc0d";
    ctx.fillText(objectiveText, window.innerWidth / 2, 50);

    ctx.restore();
}

let leonQuote = "";
let leonQuoteTimer = 0;

export function showLeonQuote(text, duration = 180) {
    leonQuote = text;
    leonQuoteTimer = duration;
}

export function drawLeonQuote(ctx, player, camera, ZOOM) {
    if (leonQuoteTimer <= 0) return;

    leonQuoteTimer--;

    const x = Math.round((player.x - camera.x + player.width / 2) * ZOOM);
    const y = Math.round((player.y - camera.y - 5) * ZOOM);

    ctx.save();

    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";

    // shadow
    ctx.fillStyle = "black";
    ctx.fillText(leonQuote, x + 2, y + 2);

    // text
    ctx.fillStyle = "white";
    ctx.fillText(leonQuote, x, y);

    ctx.restore();
}

const leonQuotes = [
    "Where'd everybody go? Bingo?",
    "No thanks, bro.",
    "September 30th, 1998. The day I'll never forget.",
    "Finally some peace and quiet.",
    "Sorry, I don't do autographs.",
    "I feel like a milion bucks.",
    "Sorry I'am not on the menu.",
];

export function randomLeonQuote() {
    const randomIndex = Math.floor(Math.random() * leonQuotes.length);

    showLeonQuote(leonQuotes[randomIndex]);
}