const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
let score = 0;
let running = false;

const bricks = [];
const player = { x: 50, y: 200, width: 40, height: 40, color: "orange" };

function startGame() {
  const selectedStage = document.getElementById("stageSelect").value;
  const selectedCookie = document.getElementById("cookieSelect").value;

  // URL 쿼리 문자열 구성 : ex. /stage2.html?cookie=zombie
  const query = `?cookie=${selectedCookie}`;

  switch (selectedStage) {
    case "1":
      window.location.href = `./stage1.html${query}`;
      break;
    case "2":
      window.location.href = `./stage2.html${query}`;
      break;
    case "3":
      window.location.href = `./stage3.html${query}`;
      break;
    case "bonus":
      window.location.href = `./bonus.html${query}`;
      break;
    default:
      alert("올바른 스테이지를 선택하세요.");
  }
}
