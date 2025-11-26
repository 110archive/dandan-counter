// State
let count = 1;
let isDarkMode = getInitialDarkMode();
let loopEnabled = false;
let loopMax = 10;

// 초기 다크모드 값 결정 (로컬스토리지 > 시스템 설정)
function getInitialDarkMode() {
  const stored = localStorage.getItem("darkMode");
  if (stored !== null) {
    return stored === "true";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// DOM Elements
const app = document.getElementById("app");
const counterEl = document.getElementById("counter");
const darkModeBtn = document.getElementById("darkModeBtn");
const loopBtn = document.getElementById("loopBtn");
const loopMaxInput = document.getElementById("loopMaxInput");
const resetBtn = document.getElementById("resetBtn");
const repeatIcon = loopBtn.querySelector(".repeat-icon");

// Functions
function updateCounter() {
  counterEl.textContent = count;
}

function incrementCount() {
  if (loopEnabled) {
    count = count >= loopMax ? 1 : count + 1;
  } else {
    count++;
  }
  updateCounter();
}

function resetCount() {
  count = 1;
  updateCounter();
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.documentElement.classList.toggle("dark", isDarkMode);
  localStorage.setItem("darkMode", isDarkMode);
}

function toggleLoop() {
  loopEnabled = !loopEnabled;
  repeatIcon.classList.toggle("active", loopEnabled);
  loopMaxInput.classList.toggle("hidden", !loopEnabled);
}

function handleLoopMaxChange(e) {
  const value = parseInt(e.target.value);
  if (!isNaN(value) && value > 0) {
    loopMax = value;
    if (count > value) {
      count = 1;
      updateCounter();
    }
  }
}

// Event Listeners
app.addEventListener("click", (e) => {
  // 버튼이나 입력창 클릭 시 카운터 증가 방지
  if (e.target.closest(".controls")) return;
  incrementCount();
});

darkModeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDarkMode();
});

loopBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleLoop();
});

loopMaxInput.addEventListener("click", (e) => {
  e.stopPropagation();
});

loopMaxInput.addEventListener("change", handleLoopMaxChange);
loopMaxInput.addEventListener("input", handleLoopMaxChange);

resetBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  resetCount();
});

// Keyboard event
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    incrementCount();
  }
});

// Initialize
updateCounter();
document.documentElement.classList.toggle("dark", isDarkMode);
