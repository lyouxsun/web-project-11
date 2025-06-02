// 🔹 [1] 속도 증가 아이템
function activateSpeedBoost() {
  if (speedBoostActive) return;

  speedBoostActive = true;

  // 5초 후 원래 속도로 복귀
  setTimeout(() => {
    speedBoostActive = false;
  }, 5000);
}

// 🔹 [2] 체력 회복 아이템
function restoreHP(maxHp = 3) {
  if (hp >= maxHp) return; // 이미 풀피면 그대로
  hp += 1;
}

// 🔹 [3] 점수 증가 아이템
function bonusScore(amount = 5) {
  score += amount;
}