const bootLines = [
  "[BOOT SEQUENCE INITIATED...]",
  "→ Checking memory banks...",
  "→ Loading hackOS kernel [v3.88.77-CYBER]",
  "→ Mounting partitions /root /cyberspace /neural",
  "→ Scanning input ports... FOUND 3x TERMINALS",
  "→ Injecting memory exploit...",
  "→ Decrypting Uplink Key...",
  "→ Firewall override: SUCCESS",
  "→ Establishing session link...",
  "[ACCESS CHANNEL OPENED]",
  "LOGIN: operator_01",
  "AUTH: ********* OK",
  ">> SYSTEM ONLINE"
];

const bootText = document.getElementById("boot-text");
const container = document.getElementById("boot-container");
const startOverlay = document.getElementById("start-overlay");
const startButton = document.getElementById("start-button");
const gameContainer = document.getElementById("game-container");
const mainTitle = document.getElementById("main-title");

// Web Audio API
const audio = new AudioContext();
function beep(freq = 220, dur = 0.05, vol = 0.3) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  gain.gain.value = vol;
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur);
}

function glitchLine(line, callback) {
  let i = 0;
  const interval = setInterval(() => {
    let fakeChar = String.fromCharCode(33 + Math.random() * 94);
    const glitched = line.substring(0, i) + fakeChar.repeat(line.length - i);
    let lines = bootText.textContent.trimEnd().split('\n');
    if(lines.length > 0) lines.pop();
    lines.push(glitched);
    bootText.textContent = lines.join('\n');
    beep(200 + Math.random() * 200, 0.02);
    i++;
    if (i > line.length) {
      clearInterval(interval);
      bootText.textContent += "\n";
      if (callback) callback();
      container.scrollTop = container.scrollHeight;
    }
  }, 15 + Math.random() * 30);
}

function typeNextLine(index = 0) {
  if (index >= bootLines.length) {
    setTimeout(() => {
      container.style.display = "none";
      mainTitle.style.display = "block";
      gameContainer.style.visibility = "visible";
    }, 1000);
    return;
  }
  glitchLine(bootLines[index], () => {
    setTimeout(() => typeNextLine(index + 1), 150 + Math.random() * 300);
  });
}

startButton.addEventListener("click", () => {
  if (audio.state !== "running") audio.resume();
  startOverlay.style.display = "none";
  container.style.display = "block";
  typeNextLine();
});

// === GAME CODE (z gra.html) ===
const terminal = document.getElementById("terminal");
const result = document.getElementById("result");
const progressBar = document.getElementById("progress-bar");
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
