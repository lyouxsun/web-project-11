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

function selectCookie(button, cookieName) {
  // 모든 버튼 초기화
  const allButtons = document.querySelectorAll(".select_btn");
  allButtons.forEach((btn) => {
    btn.textContent = "선택하기";
    btn.disabled = false;
    btn.classList.remove("selected");
  });

  // 선택한 버튼 스타일 변경
  button.textContent = "선택됨";
  button.disabled = true;
  button.classList.add("selected");

  // 선택된 쿠키 저장
  localStorage.setItem("selectedCookie", cookieName);
}

function selectStage(stageId) {
  localStorage.setItem("selectedStage", stageId);
  alert(`${stageId} 스테이지를 선택하셨습니다!`);
}
