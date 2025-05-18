// 캔버스 및 UI 요소 참조
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const hpEl = document.getElementById("hp");
const timerEl = document.getElementById("timer");

// 게임 상태 전역 변수
let score = 0;
let highScore = 0;
let hp = 3;
let timeLeft = 180;
let running = false;
let step = 0;

let redBlocks = [];
let blueBlocks = [];

// 플레이어 정보
const playerImage = new Image();
playerImage.src = "../images/brave.png";

const player = {
  x: 50,
  y: 200,
  width: 40,
  height: 40,
  image: playerImage
};

// 블록 생성 시 움직이지 않도록 dy 제거
function spawnBlocks() {
  if (Math.random() < 0.03) {
    const y = Math.random() * 300 + 100;
    const block = {
      x: 800,
      y,
      width: 30,
      height: 30,
      speed: 1.5,
    };
    if (Math.random() < 0.5) {
      redBlocks.push({ ...block }); // 장애물
    } else {
      blueBlocks.push({ ...block }); // 아이템 (고정)
    }
  }
}

function update() {
  // 장애물 이동 및 충돌
  redBlocks.forEach((o, i) => {
    o.x -= o.speed;
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      hp--;
      redBlocks.splice(i, 1);
      if (hp <= 0) {
        running = false;
        alert("게임 오버!");
      }
    }
  });

  // update에서 y 이동 삭제
  blueBlocks.forEach((b, i) => {
    b.x -= b.speed;
    if (
      player.x < b.x + b.width &&
      player.x + player.width > b.x &&
      player.y < b.y + b.height &&
      player.y + player.height > b.y
    ) {
      score++;
      if (score > highScore) highScore = score;
      blueBlocks.splice(i, 1);
    }
  });

  // 화면 밖 제거
  redBlocks = redBlocks.filter((o) => o.x + o.width > 0);
  blueBlocks = blueBlocks.filter((b) => b.x + b.width > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#87CEFA";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  animatePlayer();

  for (const o of redBlocks) {
    ctx.fillStyle = "red";
    ctx.fillRect(o.x, o.y, o.width, o.height);
  }

  for (const b of blueBlocks) {
    ctx.fillStyle = "blue";
    ctx.fillRect(b.x, b.y, b.width, b.height); // 네모로 그림
  }
}

function countdown() {
  const interval = setInterval(() => {
    if (!running) return clearInterval(interval);
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      running = false;
      alert("시간 초과! 게임 종료!");
      clearInterval(interval);
    }
  }, 1000);
}

function gameLoop() {
  if (!running) return;
  update();
  draw();
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;
  hpEl.textContent = hp;
  spawnBlocks();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  hp = 3;
  timeLeft = 180;
  running = true;
  redBlocks = [];
  blueBlocks = [];
  countdown();
  gameLoop();
}
function animatePlayer() {
  // 부드러운 흔들림 없이 그냥 현재 위치에 그리기  
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    player.y = Math.max(player.y - 20, 0); // 위로 이동 (최소 0)
  } else if (e.key === "ArrowDown") {
    player.y = Math.min(player.y + 20, canvas.height - player.height); // 아래로 이동 (최대 캔버스 경계)
  }
});

window.addEventListener("DOMContentLoaded", () => {
  startGame(); 
});