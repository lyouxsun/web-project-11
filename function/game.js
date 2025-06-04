const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resultScore = document.getElementById("resultScore");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const brickImage = new Image();
brickImage.src = "../images/brick.png";

let score = 0;
let highScore = 0;
let running = false;

const selectedStage = localStorage.getItem("selectedStage") || "1";
const selectedCookie = localStorage.getItem("selectedCookie") || "brave";

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
playerImage.src = `../images/cookies/${selectedCookie}.png`;

let cookieSpeed = 30;
if (selectedCookie === "ninja") cookieSpeed = 40;
else if (selectedCookie === "muscle") cookieSpeed = 25;
else if (selectedCookie === "wizard") cookieSpeed = 35;

const player = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 100,
  width: 80,
  height: 100,
  speed: cookieSpeed,
};

const initialBallSpeed =
  selectedStage === "2" ? 3 : selectedStage === "3" ? 4 : 2;

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  dx: initialBallSpeed,
  dy: -initialBallSpeed,
  radius: 8,
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

const brickWidth = 80;
const brickHeight = 80;
const brickPadding = 0;
const brickOffsetTop = 30;

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

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff5722";
  ctx.fill();
  ctx.closePath();
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

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brickHeight
        ) {
          ball.dy = -Math.sign(ball.dy) * initialBallSpeed;
          b.status = 0;
          score++;
          if (score > highScore) highScore = score;
        }
      }
    }
  }
}

function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 벽 충돌
  if (
    ball.x + ball.dx > canvas.width - ball.radius ||
    ball.x + ball.dx < ball.radius
  ) {
    ball.dx = -Math.sign(ball.dx) * initialBallSpeed;
  }

  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -Math.sign(ball.dy) * initialBallSpeed;
  } else if (
    ball.y + ball.dy > player.y &&
    ball.x > player.x &&
    ball.x < player.x + player.width
  ) {
    const collidePoint = ball.x - (player.x + player.width / 2);
    const normalizedPoint = collidePoint / (player.width / 2);
    const angle = (normalizedPoint * Math.PI) / 3;
    ball.dx = initialBallSpeed * Math.sin(angle);
    ball.dy = -initialBallSpeed * Math.cos(angle);
  } else if (ball.y + ball.dy > canvas.height) {
    running = false;
    alert("게임 오버!");
    document.location.reload();
  }

  collisionDetection();
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;

  if (allBricksCleared()) {
    running = false;
    draw();
    setTimeout(() => {
      alert(`🎉 클리어!\n점수: ${score}`);
      const retry = confirm("다시 시작하시겠습니까?");
      if (retry) {
        startGame();
      } else {
        window.location.href = "../select/select.html";
      }
    }, 200);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPlayer();
}

function gameLoop() {
  if (!running) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  running = true;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 120;
  ball.dx = initialBallSpeed;
  ball.dy = -initialBallSpeed;
  player.x = canvas.width / 2 - 50;

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
  }
});

window.addEventListener("DOMContentLoaded", () => {
  startGame();
});

restartBtn.addEventListener("click", () => {
  startGame();
});

backBtn.addEventListener("click", () => {
  window.location.href = "../select/select.html";
});
