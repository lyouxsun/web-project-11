// item.js ==> game.js에 아직 반영x (어떻게 게임에 반영할 지 정할 필요요)

let speedBoostActive = false;

// 🔹 [1] 속도 증가 아이템
function activateSpeedBoost(callback) {
  if (speedBoostActive) return;

  speedBoostActive = true;
  const boostedSpeed = getCurrentSpeed() + 3;

  // 콜백으로 현재 속도 갱신
  callback(boostedSpeed);

  // 5초 후 원래 속도로 복귀
  setTimeout(() => {
    speedBoostActive = false;
    callback(getCurrentSpeed());
  }, 5000);
}

// 🔹 [2] 체력 회복 아이템
function restoreHP(hp, maxHp = 3) {
  if (hp >= maxHp) return hp; // 이미 풀피면 그대로
  return hp + 1;
}

// 🔹 [3] 점수 증가 아이템
function bonusScore(score, amount = 5) {
  return score + amount;
}