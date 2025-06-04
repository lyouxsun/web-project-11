let startTime = Date.now();
let speedBoostActive = false;
let revivedOnce = false;

// 기본 쿠키 속도
const baseSpeedMap = {
  brave: 10,
  boarder: 14,
  zombie: 10,
};

// 현재 쿠키의 기본 속도 반환
function getBaseSpeed() {
  return baseSpeedMap[selectedCookie];
}

function getSpeed() {
  if (speedBoostActive) {
    return (getBaseSpeed() + 10) / 10;
  } else {
    return (getBaseSpeed() + 5) / 10;
  }
}

function cssAbility() {
  alert("K키를 누르면 display:none");

  // 사용 가능한 벽돌 수집
  const availableBricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        availableBricks.push({ c, r });
      }
    }
  }

  // 최대 3개의 벽돌 제거
  for (let i = 0; i < 3 && availableBricks.length > 0; i++) {
    const index = Math.floor(Math.random() * availableBricks.length);
    const { c, r } = availableBricks.splice(index, 1)[0];
    bricks[c][r].status = 0;
  }
}
