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

// 시간 경과에 따른 추가 속도 계산
// function getTimeBoost() {
//   const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
//   return Math.floor(secondsElapsed / 30); // 30초마다 +1
// }

// 최종 이동 속도 반환
// function getCurrentSpeed() {
//   const selectedCookie = localStorage.getItem("selectedCookie");
//   if (selectedCookie === "zombie") return 10;
//   if (selectedCookie === "boarder") return 14;
//   return 4; // brave 기본 속도
// }

// 현재 속도 반환
function getSpeed() {
  if (speedBoostActive) {
    return (getBaseSpeed() + 10) / 10;
  } else {
    return (getBaseSpeed() + 5) / 10;
  }
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
    message: "좀비맛 쿠키가 부활했습니다!",
  };
}
