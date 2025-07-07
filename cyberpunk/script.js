const terminal = document.getElementById("terminal");
const result = document.getElementById("result");
const progressBar = document.getElementById("progress-bar");
const gameContainer = document.getElementById("game-container");
const startOverlay = document.getElementById("start-overlay");
const introText = document.getElementById("intro-text");
const startButton = document.getElementById("start-button");

const WORD_LIST = [
  "VECTOR", "SYSTEM", "BREACH", "CYBERS", "ACCESS", "PROTON", "UPLOAD",
  "ZER0ED", "QUANTA", "STATIC", "OUTPUT", "MATRIX", "VIRUSX", "GAMBLE", "PYTHON", "FISSION"
];

let password = "";
let attempts = 4;
let clicked = false;
let timer = null;
let totalTime = 30;
let timeLeft = totalTime;

function blinkText(element, interval = 600) {
  let visible = true;
  return setInterval(() => {
    element.style.opacity = visible ? '1' : '0.1';
    visible = !visible;
  }, interval);
}

function pulseButton(button) {
  button.animate(
    [
      { boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff' },
      { boxShadow: '0 0 30px #ff33ff, 0 0 60px #ff33ff' },
      { boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff' }
    ],
    {
      duration: 1500,
      iterations: Infinity,
    }
  );
}

let blinkInterval = blinkText(introText);
setTimeout(() => {
  clearInterval(blinkInterval);
  introText.style.opacity = '1';
  introText.style.color = '#ff99ff';
  introText.style.textShadow = '0 0 30px #ff99ff';

  startButton.style.display = 'inline-block';
  pulseButton(startButton);
}, 3000);

startButton.onclick = () => {
  startOverlay.style.display = "none";
  gameContainer.style.visibility = "visible";
};

function startHack() {
  terminal.innerHTML = "";
  result.innerText = "";
  clicked = false;
  attempts = 4;
  timeLeft = totalTime;
  progressBar.style.width = "100%";

  password = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  const candidates = shuffle([...WORD_LIST]).slice(0, 7);
  if (!candidates.includes(password)) {
    candidates[Math.floor(Math.random() * candidates.length)] = password;
  }

  for (let i = 0; i < 18; i++) {
    const word = candidates[Math.floor(Math.random() * candidates.length)];
    const line = injectWord(randomLine(), word);
    const div = document.createElement("div");
    div.classList.add("line");
    div.innerText = line;
    div.addEventListener("click", () => checkLine(div, line));
    terminal.appendChild(div);
  }

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    progressBar.style.width = `${(timeLeft / totalTime) * 100}%`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame(false, ">>> CZAS MINĄŁ! <<<");
    }
  }, 1000);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function randomLine() {
  const chars = "!@#$%^&*()_+-={}[]<>|0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 34; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function injectWord(base, word) {
  const pos = Math.floor(Math.random() * (base.length - word.length));
  return base.slice(0, pos) + word + base.slice(pos + word.length);
}

function extractWord(text) {
  const match = text.match(/[A-Z]{6}/);
  return match ? match[0] : null;
}

function getMatchingLetters(a, b) {
  return [...a].filter((char, i) => char === b[i]).length;
}

function checkLine(div, line) {
  if (clicked || div.classList.contains("clicked")) return;
  const guess = extractWord(line);
  if (!guess) return;

  div.classList.add("clicked");

  if (guess === password) {
    div.classList.add("success");
    clicked = true;
    clearInterval(timer);
    endGame(true, ">>> DOSTĘP PRZYZNANY <<<");
  } else {
    const match = getMatchingLetters(guess, password);
    attempts--;
    if (attempts <= 0) {
      div.classList.add("failure");
      clicked = true;
      clearInterval(timer);
      endGame(false, `>>> ZABLOKOWANO! HASŁO TO: ${password}`);
    } else {
      div.classList.add("wrong");
      result.innerText = `✖ ${guess} | Zgodnych znaków: ${match}/6`;
      result.style.color = "#ffcc00";
    }
  }
}

function endGame(success, msg) {
  result.innerText = msg;
  result.style.color = success ? "#00ff66" : "#ff0033";
}