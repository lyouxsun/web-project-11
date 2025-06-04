let items = [];
const ITEM_DROP_RATE = 0.15; // 15% 확률
const ITEM_SIZE = 40;

const itemImages = {
  speed: new Image(),
  big: new Image(),
};
itemImages.speed.src = "../images/items/SpeedUp.png";
itemImages.big.src = "../images/items/Giant.png";

let speedBoostActive = false;
let bigBallActive = false;

function collisionDetection() {
  balls.forEach((b) => {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = bricks[c][r];
        if (brick.status === 1) {
          if (
            b.x > brick.x &&
            b.x < brick.x + brickWidth &&
            b.y > brick.y &&
            b.y < brick.y + brickHeight
          ) {
            b.dy = -Math.sign(b.dy) * initialBallSpeed;
            brick.status = 0;
            score++;
            if (score > highScore) highScore = score;

            if (Math.random() < ITEM_DROP_RATE) {
              const type = Math.random() < 0.5 ? "speed" : "big";
              const item = {
                x: brick.x + brickWidth / 2 - ITEM_SIZE / 2,
                y: brick.y,
                type,
                activated: false,
                createdAt: Date.now(),
              };
              items.push(item);
            }
          }
        }
      }
    }
  });
}

function activateSpeedBoost() {
  if (speedBoostActive) return;
  speedBoostActive = true;

  balls.forEach((b) => {
    b.dx *= 1.8;
    b.dy *= 1.8;
  });
  setTimeout(() => {
    balls.forEach((b) => {
      b.dx /= 1.8;
      b.dy /= 1.8;
    });
    speedBoostActive = false;
  }, 4000);
}

function activateBigBall() {
  if (bigBallActive) return;
  bigBallActive = true;

  balls.forEach((b) => {
    b.radius *= 1.5;
  });

  setTimeout(() => {
    balls.forEach((b) => {
      b.radius /= 1.5;
    });
    bigBallActive = false;
  }, 4000);
}