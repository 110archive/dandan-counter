// State
let count = 1;
let isDarkMode = getInitialDarkMode();
let loopEnabled = false;
let loopMax = 10;
let soundEnabled = getSoundEnabled();

// Audio Context for sound feedback
let audioContext = null;

function getSoundEnabled() {
  const stored = localStorage.getItem("soundEnabled");
  return stored === "true";
}

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playClickSound() {
  if (!soundEnabled) return;

  try {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Audio not supported
  }
}

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

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
const soundBtn = document.getElementById("soundBtn");
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

  // 애니메이션 효과
  counterEl.classList.remove("pulse");
  void counterEl.offsetWidth; // reflow 트리거
  counterEl.classList.add("pulse");

  // 진동 피드백
  vibrate();

  // 소리 피드백
  playClickSound();
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

function toggleSound() {
  soundEnabled = !soundEnabled;
  soundBtn.classList.toggle("sound-enabled", soundEnabled);
  localStorage.setItem("soundEnabled", soundEnabled);

  // 활성화 시 테스트 소리 재생
  if (soundEnabled) {
    playClickSound();
  }
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

soundBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleSound();
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
soundBtn.classList.toggle("sound-enabled", soundEnabled);
