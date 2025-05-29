let startTime = Date.now();
let speedBoostActive = false;
let revivedOnce = false;

// 기본 쿠키 속도
const baseSpeedMap = {
  brave: 5,
  boarder: 7,
  zombie: 4,
};

// 선택된 쿠키
const selectedCookie = localStorage.getItem("cookie") || "brave";

// 현재 쿠키의 기본 속도 반환
function getBaseSpeed() {
  return baseSpeedMap[selectedCookie] || 5;
}

// 시간 경과에 따른 추가 속도 계산
function getTimeBoost() {
  const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
  return Math.floor(secondsElapsed / 30); // 30초마다 +1
}

// 최종 이동 속도 반환
function getCurrentSpeed() {
  const baseSpeed = getBaseSpeed();
  const boost = getTimeBoost();
  return baseSpeed + boost;
}

// 보더맛 쿠키 - 빠름 (이미 base 속도에서 반영되어 있음)

// 좀비맛 쿠키 - 1회 부활 가능
function canRevive() {
  return selectedCookie === "zombie" && !revivedOnce;
}

function useRevive() {
  revivedOnce = true;
  return {
    hpRestored: 1,
    message: "좀비맛 쿠키가 부활했습니다!"
  };
}
