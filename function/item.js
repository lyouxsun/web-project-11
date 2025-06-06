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
    outerLoop: for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = bricks[c][r];
        if (brick.status !== 1) continue;

        if (
          b.x + b.radius > brick.x &&
          b.x - b.radius < brick.x + brickWidth &&
          b.y + b.radius > brick.y &&
          b.y - b.radius < brick.y + brickHeight
        ) {
          // 충돌 방향 계산
          const dx = b.x - (brick.x + brickWidth / 2);
          const dy = b.y - (brick.y + brickHeight / 2);

          if (Math.abs(dx) > Math.abs(dy)) {
            b.dx = -Math.sign(b.dx) * initialBallSpeed;
          } else {
            b.dy = -Math.sign(b.dy) * initialBallSpeed;
          }

          // 벽돌 제거
          brick.status = 0;
          score++;
          if (score > highScore) highScore = score;

          // 아이템 드랍
          if (Math.random() < ITEM_DROP_RATE) {
            const availableTypes = [];
            if (!speedBoostActive) availableTypes.push("speed");
            if (!bigBallActive) availableTypes.push("big");

            if (availableTypes.length > 0) {
              const type =
                availableTypes[
                  Math.floor(Math.random() * availableTypes.length)
                ];
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

          break outerLoop; // ✅ 하나만 깨고 나가기
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
