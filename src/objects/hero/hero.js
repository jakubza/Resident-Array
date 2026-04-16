const playerImg = new Image();
playerImg.src = "assets/player.png";

const player = {
  x: 100,
  y: 100,
  width: 128,
  height: 128,
  speed: 3
};


  ctx.drawImage(
    playerImg,
    player.x,
    player.y,
    player.width,
    player.height
  );