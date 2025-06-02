// 캔버스 및 UI 요소 참조
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const hpEl = document.getElementById("hp");
const timerEl = document.getElementById("timer");

const gravity = 0.23;
const obstacleSpawnInterval = 2000;
const brickSpawnInterval = 1000;
const itemSpawnInterval = 3000;

// 게임 상태 전역 변수
let score = 0;
let highScore = 0;
let hp = 3;
let timeLeft = 180;
let running = false;
let step = 0;
let speed;
let dy = 0;
let isJumping = false; // 상승 중인가
let isOnAir = false; // 떠있는가
let lastObstacleSpwanTime = 0;
let lastBrickSpwanTime = 0;
let lasstItemSpawnTime = 0;

let obstacles = [];
let bricks = [];
let items = [];

// 쿠키 이미지 선택
const selectedCookie = localStorage.getItem("selectedCookie") || "brave";

const playerImage = new Image();
playerImage.src = `../images/cookies/${selectedCookie}.png`;

const player = {
  x: 50,
  y: 200,
  width: 50,
  height: 60,
  image: playerImage,
};

// 스테이지 이미지 선택
const selectedStage = localStorage.getItem("selectedStage") || "1";
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

// 블록 이미지 로딩
const obstaclesImage = new Image();
obstaclesImage.src = "../images/obstacles/obstacles2.png"; // 장애물 이미지 경로

const bricksImage = new Image();
bricksImage.src = "../images/jelly/jelly1.png"; // 벽돌 이미지 경로

const itemsImage = new Image();
itemsImage.src = "../images/items/life.png"; // 아이템템 이미지 경로

function spawnBlocks(timestamp) {
  if (timestamp - lastObstacleSpwanTime > obstacleSpawnInterval) {
    let r = Math.random();
    if (r < 0.5) {
      const obstacleY = 350;
      const obstacle = {
        x: 800,
        y: obstacleY,
        width: 30,
        height: 30,
        speed: 1.5,
      };
      obstacles.push({ ...obstacle });
    }
    lastObstacleSpwanTime = timestamp;
  }
  if (timestamp - lastBrickSpwanTime > brickSpawnInterval) {
    const brickY = 220;
    const brick = {
      x: 800,
      y: brickY,
      width: 30,
      height: 30,
      speed: 1.5,
    };
    bricks.push({ ...brick });
    lastBrickSpwanTime = timestamp;
  }
  if (timestamp - lasstItemSpawnTime > itemSpawnInterval) {
    const itemY = 300;
    const item = {
      x: 800,
      y: itemY,
      width: 30,
      height: 30,
      speed: 1.5,
    };
    items.push({ ...item });
    lasstItemSpawnTime = timestamp;
  }
}

function update() {
  // 속도 갱신
  speed = getSpeed();

  // 장애물 이동 및 충돌
  obstacles.forEach((o, i) => {
    o.x -= speed;
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      hp--;
      if (hp <= 0) {
        if (canRevive()) {
          const revive = useRevive(); // 좀비맛 쿠키 부활 반영
          hp = revive.hpRestored;
          alert(revive.message);
        } else {
          running = false;
          alert("게임 오버!");
        }
      }
      obstacles.splice(i, 1);
    }
  });

  // update에서 y 이동 삭제
  bricks.forEach((b, i) => {
    b.x -= speed;
    if (
      player.x < b.x + b.width &&
      player.x + player.width > b.x &&
      player.y < b.y + b.height &&
      player.y + player.height > b.y
    ) {
      score++;
      // if (score > highScore) highScore = score;
      bricks.splice(i, 1);
    }
  });

  items.forEach((t, i) => {
    t.x -= speed;
    if (
      player.x < t.x + t.width &&
      player.x + player.width > t.x &&
      player.y < t.y + t.height &&
      player.y + player.height > t.y
    ) {
      let r = Math.random() * 3;
      if (r > 2) {
        console.log("속도 증가");
        activateSpeedBoost();
      } else if (r > 1) {
        console.log("HP 회복");
        restoreHP();
      } else {
        console.log("보너스 점수");
        bonusScore();
      }
      items.splice(i, 1);
    }
  });
  
  // 최고 점수 갱신
  if (score > highScore) highScore = score;

  // 화면 밖 제거
  obstacles = obstacles.filter((o) => o.x + o.width > 0);
  bricks = bricks.filter((b) => b.x + b.width > 0);
  items = items.filter((t) => t.x + t.width > 0);

  // 중력 계산
  if (player.y < canvas.height - player.height) dy += gravity;
  else dy = 0;

  // 점프
  if (isJumping) dy = -8;

  // 속도 적용
  if (player.y <= canvas.height - player.height) player.y += dy;
  if (player.y > canvas.height - player.height)
    player.y = canvas.height - player.height;

  // 공중에 떠있는가 확인
  if (player.y < canvas.height - player.height) isOnAir = true;
  else isOnAir = false;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 배경 이미지로 채우기
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  animatePlayer();

  for (const o of obstacles) {
    ctx.drawImage(obstaclesImage, o.x, o.y, o.width, o.height); // 장애물 이미지
  }

  for (const b of bricks) {
    ctx.drawImage(bricksImage, b.x, b.y, b.width, b.height); // 벽돌 이미지
  }

  for (const t of items) {
    ctx.drawImage(itemsImage, t.x, t.y, t.width, t.height); // 아이템 이미지
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

function gameLoop(timestamp) {
  if (!running) return;
  update();
  draw();
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;
  hpEl.textContent = hp;
  spawnBlocks(timestamp);
  requestAnimationFrame(gameLoop);
}

// 초기 속도 설정
// let playerSpeed = getCurrentSpeed(); // ← cookie.js에서 불러옴 (이유신)

function startGame() {
  score = 0;
  hp = 3;
  timeLeft = 180;
  running = true;
  redBlocks = [];
  blueBlocks = [];
  countdown();
  requestAnimationFrame(gameLoop);
}

function animatePlayer() {
  // 부드러운 흔들림 없이 그냥 현재 위치에 그리기
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}
document.addEventListener("keydown", (e) => {
  // playerSpeed = getCurrentSpeed(); // 시간에 따라 점점 빨라짐 반영

  if (e.key === "ArrowUp") {
    // player.y = Math.max(player.y - playerSpeed, 0); // 위로 이동, 쿠키마다 속도 차이 반영
    if (!(isJumping || isOnAir)) {
      isJumping = true;
      // console.log(isJumping);
      setTimeout(() => {
        isJumping = false;
        // console.log(isJumping, '다시 거짓으로')
      }, 200);
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  startGame();

  //다시 시작 버튼
  const restartBtn = document.getElementById("restartBtn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      running = false; // 게임 중단
      alert("3초 후 게임이 다시 시작됩니다!");
      setTimeout(() => {
        startGame();
      }, 3000);
    });
  }

  //선택화면으로 돌아가기
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "../select/select.html";
    });
  }
});
