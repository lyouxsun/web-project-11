const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resultScore = document.getElementById("resultScore");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const brickImage = new Image();
const ballImage = new Image();

brickImage.src = "../images/brick.png";

let score = 0;
let highScore = 0;
let running = false;

const selectedStage = localStorage.getItem("selectedStage") || "1";
const selectedCookie = localStorage.getItem("selectedCookie") || "HTML_Cookie";
ballImage.src = `../images/balls/${selectedCookie}.png`; // 선택된 쿠키가 공 이미지 역할
brickImage.src = "../images/brick.png";
const backgroundImage = new Image();
backgroundImage.src = `../images/background/${
  selectedStage === "1"
    ? "oven0fWitch.png"
    : selectedStage === "2"
    ? "sunflower.png"
    : selectedStage === "3"
    ? "sea.png"
    : "bonus.png"
}`;

const playerImage = new Image();
playerImage.src = `../images/bar.png`;

let playerSpeed = 30;
if (selectedCookie === "HTML_Cookie") playerSpeed = 40;
else if (selectedCookie === "CSS_Cookie") playerSpeed = 25;
else if (selectedCookie === "JS_Cookie") playerSpeed = 35;

const initialBallSpeed =
  selectedStage === "2" ? 5 : selectedStage === "3" ? 7 : 4;

const player = {
  x: canvas.width / 2 - 100,
  y: canvas.height - 100,
  width: 400,
  height: 100,
  speed: playerSpeed,
};

let brickRowCount = 2;
let brickColumnCount = 2;

if (selectedStage === "2") {
  brickRowCount = 3;
  brickColumnCount = 3;
} else if (selectedStage === "3") {
  brickRowCount = 3;
  brickColumnCount = 5;
}

const brickWidth = 100;
const brickHeight = 100;
const brickPadding = 0;
const brickOffsetTop = 70;

function calculateBrickOffsetLeft() {
  const totalWidth =
    brickColumnCount * (brickWidth + brickPadding) - brickPadding;
  return (canvas.width - totalWidth) / 2;
}
const brickOffsetLeft = calculateBrickOffsetLeft();

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function allBricksCleared() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) return false;
    }
  }
  return true;
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBalls() {
  balls.forEach((b) => {
    ctx.drawImage(
      ballImage,
      b.x - b.radius,
      b.y - b.radius,
      b.radius * 2,
      b.radius * 2
    );
  });
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.drawImage(brickImage, brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function update() {
  balls.forEach((b) => {
    b.x += b.dx;
    b.y += b.dy;

    // 벽 충돌
    if (b.x + b.dx > canvas.width - b.radius || b.x + b.dx < b.radius) {
      b.dx = -Math.sign(b.dx) * initialBallSpeed;
    }

    if (b.y + b.dy < b.radius) {
      b.dy = -Math.sign(b.dy) * initialBallSpeed;
    } else if (
      b.y + b.dy > player.y &&
      b.x > player.x &&
      b.x < player.x + player.width
    ) {
      const collidePoint = b.x - (player.x + player.width / 2);
      const normalizedPoint = collidePoint / (player.width / 2);
      const angle = (normalizedPoint * Math.PI) / 3;
      b.dx = initialBallSpeed * Math.sin(angle);
      b.dy = -initialBallSpeed * Math.cos(angle);
    } else if (b.y + b.dy > canvas.height) {
      // 공이 아래로 떨어진 경우 해당 공만 제거
      balls = balls.filter((ball) => ball !== b);
    }
  });

  // 공이 하나도 없으면 게임 오버
  if (balls.length === 0) {
    running = false;

    (async () => {
      await showGameMessage("💥 게임 오버!", 1500);

      // 메시지 보여준 후 약간의 여유 시간 주고 리로드
      setTimeout(() => {
        document.location.reload();
      }, 500);
    })();
  }

  collisionDetection();
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;

  if (allBricksCleared()) {
    running = false;
    draw();
    (async () => {
      await showGameMessage("🎉 클리어!", 1500);

      const currentStage = parseInt(selectedStage, 10);
      if (currentStage < 3) {
        await showGameMessage(
          `다음 스테이지(${currentStage + 1})로 이동합니다!`,
          2000
        );
        localStorage.setItem("selectedStage", (currentStage + 1).toString());
        window.location.reload();
      } else {
        await showGameMessage("🎉 바깥 세상으로 탈출에 성공했습니다!", 2500);
        setTimeout(() => {
          window.location.href = "../ending/ending.html";
        }, 300);
      }
    })();
  }

  items = items.filter((item) => {
    const elapsed = Date.now() - item.createdAt;

    if (!item.activated && elapsed >= 0) {
      item.activated = true;
      if (item.type === "speed" && !speedBoostActive) {
        showMessage("🚀 광속 질주 아이템 발동!");
        activateSpeedBoost();
      } else if (item.type === "big" && !bigBallActive) {
        showMessage("🔵 거대화 아이템 발동!");
        activateBigBall();
      }
    }

    return elapsed < 3000;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBalls();
  drawPlayer();
  items.forEach((item) => {
    ctx.drawImage(itemImages[item.type], item.x, item.y, ITEM_SIZE, ITEM_SIZE);
  });
}

function gameLoop() {
  if (!running) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  abilityUsed = false;

  score = 0;
  running = true;
  player.x = canvas.width / 2 - 50;
  const newBall = {
    x: canvas.width / 2,
    y: canvas.height - 120,
    dx: initialBallSpeed,
    dy: -initialBallSpeed,
    radius: 50,
  };

  balls = [newBall];

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }

  gameLoop();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    player.x = Math.max(0, player.x - player.speed);
  } else if (e.key === "ArrowRight") {
    player.x = Math.min(canvas.width - player.width, player.x + player.speed);
  } else if (e.key === "s" || e.key === "S" || e.key === "ㄴ") {
    console.log("cookie=", selectedCookie);
    if (selectedCookie === "CSS_Cookie_Ball") {
      cssAbility();
    } else if (selectedCookie == "JS_Cookie_Ball") {
      jsAbility();
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  startGame();
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});

backBtn.addEventListener("click", () => {
  window.location.href = "../select/select.html";
});

function showMessage(text, duration = 2000) {
  const messageEl = document.getElementById("item-message");
  messageEl.textContent = text;
  messageEl.style.display = "block";

  setTimeout(() => {
    messageEl.style.display = "none";
  }, duration);
}

function showGameMessage(text, duration = 2000) {
  return new Promise((resolve) => {
    const messageEl = document.getElementById("game-message");
    const itemMessageEl = document.getElementById("item-message");
    messageEl.textContent = text;
    messageEl.style.display = "block";

    if (itemMessageEl) {
      itemMessageEl.style.display = "none";
    }

    setTimeout(() => {
      messageEl.style.display = "none";
      resolve(); // 메시지 표시가 끝나면 resolve 호출
    }, duration);
  });
}
