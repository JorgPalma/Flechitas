let score = 0;
let timeLeft = 1;
let timerInterval;
let currentArrow;
let isTrap = false;
let isPause = false;
let isSpace = false;
let isLeftRight = false;
let isUpDown = false;
let keyPressed = false;
let pauseResolved = false;
let pressedKeys = new Set();

const arrows = [
  { key: "ArrowUp", icon: '<i class="fa-solid fa-arrow-up"></i>' },
  { key: "ArrowDown", icon: '<i class="fa-solid fa-arrow-down"></i>' },
  { key: "ArrowLeft", icon: '<i class="fa-solid fa-arrow-left"></i>' },
  { key: "ArrowRight", icon: '<i class="fa-solid fa-arrow-right"></i>' }
];

const pauseArrow = { key: "Pause", icon: '<i class="fa-solid fa-pause"></i>' };
const spaceArrow = { key: "Space", icon: '<i class="fa-solid fa-minus"></i>' };
const leftRightArrow = { key: "LeftRight", icon: '<i class="fa-solid fa-arrows-left-right"></i>' };
const upDownArrow = { key: "UpDown", icon: '<i class="fa-solid fa-arrows-up-down"></i>' };

function mapWASDToArrow(key) {
  switch (key.toLowerCase()) {
    case "w": return "ArrowUp";
    case "a": return "ArrowLeft";
    case "s": return "ArrowDown";
    case "d": return "ArrowRight";
    default: return key;
  }
}

const scoreElement = document.getElementById("score");
const scoreFinal = document.getElementById("scorefinal");
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
  isTrap = false;
  isPause = false;
  isSpace = false;
  isLeftRight = false;
  isUpDown = false;
  pauseResolved = false;
  pressedKeys.clear();

  const shouldAddUpDown = score >= 75 && Math.random() < 0.15;
  const shouldAddLeftRight = score >= 75 && Math.random() < 0.15;
  const shouldAddSpace = score >= 25 && Math.random() < 0.15;
  const shouldAddPause = score >= 50 && Math.random() < 0.15;

  if (shouldAddUpDown) {
    currentArrow = upDownArrow;
    isUpDown = true;
  } else if (shouldAddLeftRight) {
    currentArrow = leftRightArrow;
    isLeftRight = true;
  } else if (shouldAddSpace) {
    currentArrow = spaceArrow;
    isSpace = true;
  } else if (shouldAddPause) {
    currentArrow = pauseArrow;
    isPause = true;
  } else {
    currentArrow = arrows[Math.floor(Math.random() * arrows.length)];
    isTrap = score >= 100 && Math.random() < 0.15;
  }

  arrowIcon.innerHTML = currentArrow.icon;
  button.style.backgroundColor = isTrap ? "#dc3545" : "#3b82f6";
}

function updateTimerBar() {
  const percent = (timeLeft / 10) * 1000;
  timerBar.style.width = percent + "%";
  timerBar.setAttribute("aria-valuenow", percent);

  if (percent > 75) {
    timerBar.style.backgroundColor = "#198754";
  } else if (percent > 50) {
    timerBar.style.backgroundColor = "#20c997";
  } else if (percent > 25) {
    timerBar.style.backgroundColor = "#ffc107";
  } else if (percent > 10) {
    timerBar.style.backgroundColor = "#fd7e14";
  } else {
    timerBar.style.backgroundColor = "#dc3545";
  }
}

function startTimer() {
  clearInterval(timerInterval);
  keyPressed = false;
  timeLeft = 1;

  timerInterval = setInterval(() => {
    timeLeft -= 0.01;

    if (isPause && keyPressed && !pauseResolved) {
      clearInterval(timerInterval);
      showGameOver();
      return;
    }

    if (isPause && timeLeft <= 0.15 && !keyPressed && !pauseResolved) {
      pauseResolved = true;
      clearInterval(timerInterval);
      increaseScore();
      return;
    }

    if (timeLeft <= 0) {
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
  startTimer();
}

function showGameOver() {
  clearInterval(timerInterval);
  gameOverElement.style.display = "block";
  scoreFinal.textContent = score;
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

  keyPressed = true;
  pressedKeys.add(event.key);

  if (isPause) return;

  if (isSpace) {
    if (event.key === " " || event.code === "Space") {
      increaseScore();
    } else {
      clearInterval(timerInterval);
      showGameOver();
    }
    return;
  }

  if (isLeftRight) {
    if (pressedKeys.has("ArrowLeft") && pressedKeys.has("ArrowRight")) {
      increaseScore();
    }
    return;
  }

  if (isUpDown) {
    if (pressedKeys.has("ArrowUp") && pressedKeys.has("ArrowDown")) {
      increaseScore();
    }
    return;
  }

  if (event.key === " " || event.code === "Space") {
    clearInterval(timerInterval);
    showGameOver();
    return;
  }

  const inputKey = mapWASDToArrow(event.key);
  const correctKey = isTrap ? getOppositeDirection(currentArrow.key) : currentArrow.key;

  if (inputKey === correctKey) {
    increaseScore();
  } else if (arrows.some(a => a.key === inputKey)) {
    clearInterval(timerInterval);
    showGameOver();
  }
}

function handleKeyUp(event) {
  pressedKeys.delete(event.key);
}

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyUp);
