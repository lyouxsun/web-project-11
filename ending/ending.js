function initGame() {
  window.location.href = "../home/home.html";
}

const storyParagraphs = [
  [
    "그들은 서로를 잊지 않았고 살아남았어.",
    "어느 날, 웹 세상에 다시 평화가 찾아오고, 버그의 잔재가 사라지자",
    "세 쿠키는 약속했던 그 장소, 햇살 가득한 코딩 마을로 돌아오게 돼.",
  ],
  [
    "HTML! CSS! JS 쿠키가 두 팔을 활짝 벌리며 웃었어. 우리가 다시 만났어!",
    "CSS 쿠키는 반짝이는 머리카락을 흔들며 활짝 웃었고,",
    "HTML 쿠키는 여전히 단단한 뼈대를 든 채 든든한 모습이었지.",
  ],
  [
    "이젠 예전보다 더 강해진 그들은 다시 힘을 합쳐 하나의 웹페이지를 만들기로 했어.",
    "HTML 쿠키는 뼈대를 만들고, CSS 쿠키는 색을 입히고, JS 쿠키는 움직임을 불어넣었지.",
    "그렇게 세 쿠키는 서로의 장점을 살리며 가장 조화롭고 멋진 웹 세상을 다시 탄생시켰어!!!",
  ],
];

const bgSources = [
  "../images/background/ending_1.png",
  "../images/background/ending_2.png",
  "../images/background/ending_3.png",
];

const storyText = document.getElementById("story-text");
const bgImg = document.getElementById("bg-img");

let paragraphIndex = 0;
let lineIndex = 0;
let charIndex = 0;

function typeLine() {
  if (paragraphIndex >= storyParagraphs.length) {
    setTimeout(initGame, 10000);
    return;
  }

  const currentParagraph = storyParagraphs[paragraphIndex];
  const currentLine = currentParagraph[lineIndex];

  if (charIndex < currentLine.length) {
    storyText.innerHTML += currentLine.charAt(charIndex);
    charIndex++;
    setTimeout(typeLine, 40); // 타자 속도
  } else {
    charIndex = 0;
    lineIndex++;
    if (lineIndex < currentParagraph.length) {
      storyText.innerHTML += "<br><br>";
      setTimeout(typeLine, 600); // 다음 줄 대기
    } else {
      // 단락 완성
      paragraphIndex++;
      lineIndex = 0;
      if (paragraphIndex < storyParagraphs.length) {
        setTimeout(() => {
          storyText.innerHTML = ""; // 다음 단락 위해 텍스트 비우기

          // ✅ 배경 이미지 전환
          if (paragraphIndex < bgSources.length) {
            bgImg.style.transition = "opacity 1s ease-in-out";
            bgImg.style.opacity = 0;

            setTimeout(() => {
              bgImg.src = bgSources[paragraphIndex];
              bgImg.onload = () => {
                bgImg.style.opacity = 1;
              };
            }, 1000);
          }

          setTimeout(typeLine, 500); // 다음 단락 타이핑 시작
        }, 1200);
      }
      // ✅ 마지막 단락이면 아무 것도 안 하고 타이핑 종료됨 (텍스트 유지)
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  bgImg.src = bgSources[0]; // 첫 번째 배경 이미지 설정
  bgImg.style.opacity = 1; // 처음에 이미지는 보이도록 설정
  bgImg.style.transition = "opacity 0.5s ease-in-out"; // 페이드 효과 설정
  setTimeout(() => {
    typeLine();
  }, 500);
});
