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
  button.textContent = "✔ 선택됨";
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
  button.textContent = "✔ 선택됨";
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

      document.querySelectorAll(".tooltip").forEach((t) => {
        if (t !== tooltip) t.classList.remove("show");
      });

      tooltip.classList.toggle("show");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("info-icon")) {
      document
        .querySelectorAll(".tooltip")
        .forEach((t) => t.classList.remove("show"));
    }
  });

  // ✅ [1] 기본값 설정
  if (!localStorage.getItem("selectedCookie")) {
    localStorage.setItem("selectedCookie", "HTML_Cookie_Ball");
  }
  if (!localStorage.getItem("selectedStage")) {
    localStorage.setItem("selectedStage", "1");
  }

  const selectedCookie = localStorage.getItem("selectedCookie");
  const selectedStage = localStorage.getItem("selectedStage");

  // ✅ [2] 쿠키 버튼 상태 반영
  const allCookieButtons = document.querySelectorAll(".select_c_btn");
  allCookieButtons.forEach((btn) => {
    if (btn.getAttribute("onclick").includes(selectedCookie)) {
      btn.textContent = "✔ 선택됨";
      btn.disabled = true;
      btn.classList.add("selected");
    } else {
      btn.textContent = "선택하기";
      btn.disabled = false;
      btn.classList.remove("selected");
    }
  });

  // ✅ [3] 스테이지 버튼 상태 반영
  const allStageButtons = document.querySelectorAll(".select_s_btn");
  allStageButtons.forEach((btn) => {
    if (btn.getAttribute("onclick").includes(`'${selectedStage}'`)) {
      btn.textContent = "✔ 선택됨";
      btn.disabled = true;
      btn.classList.add("selected");
    } else {
      btn.textContent = "선택하기";
      btn.disabled = false;
      btn.classList.remove("selected");
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

//test
