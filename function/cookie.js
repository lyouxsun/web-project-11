let startTime = Date.now();
let abilityUsed = false;

function cssAbility() {
  if (abilityUsed) return; // 이미 사용했으면 리턴
  abilityUsed = true; // 사용했음을 기록
  showSkillNotice();

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
  if (abilityUsed) return;
  abilityUsed = true;
  showJsSkillNotice();

  let newBall = {
    x: canvas.width / 2,
    y: canvas.height - 120,
    dx: initialBallSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: -initialBallSpeed,
    radius: 50,
  };
  balls.push(newBall);
}

function showSkillNotice() {
  const notice = document.getElementById("skillNotice");
  notice.style.display = "block";

  // 다시 애니메이션 재생을 위해 클래스 제거 후 재추가 (재사용 가능하게)
  notice.classList.remove("animate");
  void notice.offsetWidth; // 강제 reflow
  notice.classList.add("animate");

  setTimeout(() => {
    notice.style.display = "none";
  }, 2000); // 애니메이션 길이와 맞춤
}

function showJsSkillNotice() {
  const notice = document.getElementById("jsSkillNotice");
  notice.style.display = "block";

  notice.classList.remove("animate");
  void notice.offsetWidth; // reflow
  notice.classList.add("animate");

  setTimeout(() => {
    notice.style.display = "none";
  }, 2000);
}
