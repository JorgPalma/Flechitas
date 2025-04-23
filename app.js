let score = 0;
let timeLeft = 1;
let timerInterval;
let currentArrow;
let isTrap = false;
const arrows = [
    { key: "ArrowUp", icon: '<i class="fa-regular fa-circle-up"></i>' },
    { key: "ArrowDown", icon: '<i class="fa-regular fa-circle-down"></i>' },
    { key: "ArrowLeft", icon: '<i class="fa-regular fa-circle-left"></i>' },
    { key: "ArrowRight", icon: '<i class="fa-regular fa-circle-right"></i>' }
];

const scoreElement = document.getElementById("score");
const button = document.getElementById("arrow-button");
const arrowIcon = document.getElementById("arrow-icon");
const gameOverElement = document.getElementById("game-over");
const timerBar = document.getElementById("timer-bar");
const gameContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");

function getOppositeDirection(direction) {
    switch (direction) {
      case "ArrowUp": return "ArrowDown";
      case "ArrowDown": return "ArrowUp";
      case "ArrowLeft": return "ArrowRight";
      case "ArrowRight": return "ArrowLeft";
    }
}

function setRandomArrow() {
    currentArrow = arrows[Math.floor(Math.random() * arrows.length)];
  
    isTrap = score >= 20 && Math.random() < 0.4;
  
    const arrowSpan = document.getElementById("arrow-icon");
    arrowSpan.innerHTML = currentArrow.icon;
    button.style.backgroundColor = isTrap ? "#dc3545" : "#3b82f6";
}

function updateTimerBar() {
  const percent = (timeLeft / 10) * 1000;
  timerBar.style.width = percent + "%";
  timerBar.setAttribute("aria-valuenow", percent);

    if (percent > 75) {
        timerBar.style.backgroundColor = "#198754"; // Green
    } else if (percent > 50) {
        timerBar.style.backgroundColor = "#20c997"; // Light green
    } else if (percent > 25) {
        timerBar.style.backgroundColor = "#ffc107"; // Yellow
    } else if (percent > 10) {
        timerBar.style.backgroundColor = "#fd7e14"; // Orange
    } else {
        timerBar.style.backgroundColor = "#dc3545"; // Red
    }
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 0.01;
    if (timeLeft <= 0) {
      timeLeft = 0;
      updateTimerBar();
      clearInterval(timerInterval);
      showGameOver();
      return;
    }
    updateTimerBar();
  }, 10);
}

function increaseScore() {
  score++;
  scoreElement.textContent = score;
  button.classList.add("clicked");
  setTimeout(() => button.classList.remove("clicked"), 100);
  setRandomArrow();
  timeLeft = Math.min(1);
  updateTimerBar();
}

function showGameOver() {
  gameOverElement.style.display = "block";
  gameContainer.style.display = "none";
}

function resetGame() {
  score = 0;
  scoreElement.textContent = score;
  timeLeft = 1;
  updateTimerBar();
  setRandomArrow();
}

function startGame() {
  resetGame();
  gameOverElement.style.display = "none";
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  startTimer();
}

function handleKeyPress(event) {
    if (!gameContainer.style.display || gameContainer.style.display === "none") return;
  
    const correctKey = isTrap ? getOppositeDirection(currentArrow.key) : currentArrow.key;
  
    if (event.key === correctKey) {
      increaseScore();
    } else if (arrows.some(a => a.key === event.key)) {
      clearInterval(timerInterval);
      showGameOver();
    }
}

document.addEventListener("keydown", handleKeyPress);
