const canvas = document.getElementById("gameCanvas");
const scoreEl = document.getElementById("score");
let score = 0;
let running = false;

const bricks = [];
const player = { x: 50, y: 200, width: 40, height: 40, color: "orange" };

function startStory() {
  window.location.href = "../story/story.html";
}
