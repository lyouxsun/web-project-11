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
// let dx = 0;
let dy = 0;
let isJumping = false; // 상승 중인가
let isOnAir = false; // 떠있는가
let lastObstacleSpwanTime = 0;
let lastBrickSpwanTime = 0;
let lasstItemSpawnTime = 0;

let obstacles = [];
let bricks = [];
let items = [];

// 플레이어 정보
const playerImage = new Image();
playerImage.src = "../images/cookies/brave.png";

const bgimg = new Image();
bgimg.src = '../images/background/stage1.png';

const player = {
  x: 50,
  y: 200,
  width: 40,
  height: 40,
  image: playerImage,
};

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
      speed: 1.5
    };
    items.push({ ...item });
    lasstItemSpawnTime = timestamp;
  }
}

function update() {
  // 장애물 이동 및 충돌
  obstacles.forEach((o, i) => {
    o.x -= o.speed;
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      hp--;
      if (hp <= 0) {
        if (canRevive()) {
          const revive = useRevive(); // 좀비맛 쿠키 부활 반영영
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
    b.x -= b.speed;
    if (
      player.x < b.x + b.width &&
      player.x + player.width > b.x &&
      player.y < b.y + b.height &&
      player.y + player.height > b.y
    ) {
      score++;
      if (score > highScore) highScore = score;
      bricks.splice(i, 1);
    }
  });

  items.forEach((t, i) => {
    t.x -= t.speed;
    if (
      player.x < t.x + t.width &&
      player.x + player.width > t.x &&
      player.y < t.y + t.height &&
      player.y + player.height > t.y
    ) {
      let r = Math.random() * 3;
      if (r > 2) {
        console.log('속도 증가');
        // activateSpeedBoost();
      } else if (r > 1) {
        console.log('HP 회복');
        restoreHP();
      } else {
        console.log('보너스 점수');
        bonusScore();
      }
      items.splice(i, 1);
    }
  })

  // 화면 밖 제거
  obstacles = obstacles.filter((o) => o.x + o.width > 0);
  bricks = bricks.filter((b) => b.x + b.width > 0);
  items = items.filter((t) => t.x + t.width > 0);

  // 중력 계산
  if (player.y < canvas.height - player.height)
    dy += gravity;
  else
    dy = 0;

  // 점프
  if (isJumping)
    dy = -8;

  // 속도 적용
  if (player.y <= canvas.height - player.height)
    player.y += dy;
  if (player.y > canvas.height - player.height)
    player.y = canvas.height - player.height;

  // 공중에 떠있는가 확인
  if (player.y < canvas.height - player.height)
    isOnAir = true;
  else
    isOnAir = false;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgimg, 0, 0, canvas.width, canvas.height); // Draw background img.

  animatePlayer();

  for (const o of obstacles) {
    ctx.fillStyle = "red";
    ctx.fillRect(o.x, o.y, o.width, o.height);
  }

  for (const b of bricks) {
    ctx.fillStyle = "blue";
    ctx.fillRect(b.x, b.y, b.width, b.height); // 네모로 그림
  }

  for (const t of items) {
    ctx.fillStyle = "green";
    ctx.fillRect(t.x, t.y, t.width, t.height);
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

// 쿠키 이미지 동적 설정
const selectedCookie = localStorage.getItem("cookie") || "brave";
playerImage.src = `../images/cookies/${selectedCookie}.png`;

// 초기 속도 설정
let playerSpeed = getCurrentSpeed();  // ← cookie.js에서 불러옴 (이유신)

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
  playerSpeed = getCurrentSpeed(); // 시간에 따라 점점 빨라짐 반영

  if (e.key === "ArrowUp") {
    // console.log('윗 키 눌림');
    if (!(isJumping || isOnAir)) {
      isJumping = true;
      // console.log(isJumping);
      setTimeout(() => {
        isJumping = false;
        // console.log(isJumping, '다시 거짓으로')
      }, 200);
    }
    // player.y = Math.max(player.y - playerSpeed, 0); // 위로 이동, 쿠키마다 속도 차이 반영
  } 
  // else if (e.key === "ArrowDown") {
  //   player.y = Math.min(player.y + playerSpeed, canvas.height - player.height); // 아래로 이동, 쿠키마다 속도 차이 반영
  // }
});


window.addEventListener("DOMContentLoaded", () => {
  startGame();
});
