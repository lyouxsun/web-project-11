let startTime = Date.now();
let abilityUsed = false;

function cssAbility() {
  if (abilityUsed) return;  // 이미 사용했으면 리턴
  abilityUsed = true;       // 사용했음을 기록
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

function jsAbility() {
  console.log("js ability");
  if (abilityUsed) return;
  abilityUsed = true;
  let newBall = {
    x: canvas.width / 2,
    y: canvas.height - 120,
    dx: initialBallSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: -initialBallSpeed,
    radius: 50,
  };
  balls.push(newBall);
}
