const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
let score = 0;
let running = false;

const bricks = [];
const player = { x: 50, y: 200, width: 40, height: 40, color: "orange" };

function startGame() {
  const selectedStage = document.getElementById("stageSelect").value;
  // const cookieSelectEl = document.getElementById("cookieSelect");
  // const selectedCookie = cookieSelectEl ? cookieSelectEl.value : null;

  // switch (selectedStage) {
  // case "1":
  window.location.href = "../stage/stage.html";
  // break;
  // case "2":
  //   window.location.href = "/stage2/stage2.html";
  //   break;
  // case "3":
  //   window.location.href = "/stage3/stage3.html";
  //   break;
  // case "bonus":
  //   window.location.href = "/bonus/bonus.html";
  //   break;
  // default:
  //   alert("올바른 스테이지를 선택하세요.");
  // }
}

function selectCookies() {
  const selectedStage = document.getElementById("stageSelect").value;

  window.location.href = "../select/select.html";
}
