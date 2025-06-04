function selectCookie() {
  window.location.href = "../select/select.html";
}

const storyParagraphs = [
  [
    "오래전, HTML·CSS·JS 쿠키들은 평화로운 웹 세상에서 함께 살고 있었어.",
    "그들은 웹사이트의 기초를 이루는 소스로 구워졌고,",
    "햇살 가득한 코딩 마을에서 모두가 자유롭게 기능했지.",
  ],
  [
    "하지만 어느 날, 서버 깊은 곳에서 이상한 진동이 느껴졌어.",
    "버그의 흔적이 쿠키들의 웹 세상을 침범하기 시작했고,",
    "HTML·CSS·JS 쿠키들은 무언가 이상함을 느끼기 시작했지",
  ],
  [
    "결국 버그가 폭주하며 웹 세상이 무너지기 시작했어.",
    "CSS, HTML, JS 쿠키는 더 이상 함께 할 수 없었고,",
    "웹 세상 밖에서 다시 만나기로 약속하고 뿔뿔이 흩어져 탈출하기 시작했어…!",
  ],
];

const bgSources = [
  "../images/background/story_1.png",
  "../images/background/story_2.png",
  "../images/background/story_3.png",
];

const storyText = document.getElementById("story-text");
const bgImg = document.getElementById("bg-img");

let paragraphIndex = 0;
let lineIndex = 0;
let charIndex = 0;

function typeLine() {
  if (paragraphIndex >= storyParagraphs.length) return;

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
      setTimeout(() => {
        storyText.innerHTML = "";
        if (paragraphIndex < bgSources.length) {
          bgImg.src = bgSources[paragraphIndex];
        }
        setTimeout(typeLine, 500); // 다음 단락 시작
      }, 1200); // 단락 끝난 후 1.2초 쉬고 비우기
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  bgImg.src = bgSources[0];
  setTimeout(() => {
    typeLine();
  }, 500);
});
