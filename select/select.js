function startGame() {
  const cookie = localStorage.getItem("selectedCookie");
  const stage = localStorage.getItem("selectedStage");
  if (!cookie || !stage) {
    alert("쿠키와 스테이지를 모두 선택해주세요!");
    return;
  }
  window.location.href = "../stage/stage.html";
}

function showTab(tabName) {
  document.getElementById("cookieTab").style.display =
    tabName === "cookie" ? "block" : "none";
  document.getElementById("stageTab").style.display =
    tabName === "stage" ? "block" : "none";
}

function selectCookie(cookieName) {
  localStorage.setItem("selectedCookie", cookieName);
  alert(`${cookieName} 쿠키를 선택하셨습니다!`);
}

function selectStage(stageId) {
  localStorage.setItem("selectedStage", stageId);
  alert(`${stageId} 스테이지를 선택하셨습니다!`);
}
