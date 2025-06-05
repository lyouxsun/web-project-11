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
  const allButtons = document.querySelectorAll(".select_c_btn");
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

function selectStage(button, stageId) {
  // 모든 스테이지 버튼 초기화
  const allStageButtons = document.querySelectorAll(".select_s_btn");
  allStageButtons.forEach((btn) => {
    btn.textContent = "선택하기";
    btn.disabled = false;
    btn.classList.remove("selected");
  });

  // 선택한 버튼 스타일 변경
  button.textContent = "선택됨";
  button.disabled = true;
  button.classList.add("selected");

  // 선택된 스테이지 저장
  localStorage.setItem("selectedStage", stageId);
}

document.addEventListener("DOMContentLoaded", () => {
  const infoIcons = document.querySelectorAll(".info-icon");

  infoIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const cookieKey = icon.dataset.cookie;
      const tooltip = document.getElementById(`tooltip-${cookieKey}`);

      // 모든 tooltip 숨기기
      document.querySelectorAll(".tooltip").forEach((t) => {
        if (t !== tooltip) t.classList.remove("show");
      });

      // 토글 방식
      tooltip.classList.toggle("show");
    });
  });

  // 툴팁 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("info-icon")) {
      document
        .querySelectorAll(".tooltip")
        .forEach((t) => t.classList.remove("show"));
    }
  });
});

// 도움말 열기
document.getElementById("helpBtn").addEventListener("click", function () {
  document.getElementById("helpModal").style.display = "flex";
});

// 도움말 닫기
function closeHelp() {
  document.getElementById("helpModal").style.display = "none";
}
