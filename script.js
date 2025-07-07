const terminalText = document.getElementById("terminal-text");
const wordGrid = document.getElementById("word-grid");

let haslo = "";
let probyPozostale = 5;
let odkryteLitery = []; // tablica booleanów, które litery ujawnione

// Uruchom grę
function startGame() {
  haslo = words6[Math.floor(Math.random() * words6.length)].toUpperCase();
  probyPozostale = 5;
  odkryteLitery = new Array(haslo.length).fill(false);

  // Wyświetl tekst powitalny i stan początkowy
  wypiszTerminal(buildDisplayText());
  buildWordGrid();
  updateAttempts();
}

// Generuje wyświetlany tekst z podkreśleniami i odkrytymi literami
function buildDisplayText() {
  let line = "HASŁO: ";
  for(let i = 0; i < haslo.length; i++) {
    line += odkryteLitery[i] ? haslo[i] : "_";
    line += " ";
  }
  return line + "\n\nPRÓBY POZOSTAŁE: " + probyPozostale;
}

// Wyświetla tekst w terminalu
function wypiszTerminal(text) {
  terminalText.textContent = text;
}

// Buduje siatkę przycisków z słowami
function buildWordGrid() {
  wordGrid.innerHTML = "";
  words6.forEach(w => {
    const btn = document.createElement("button");
    btn.textContent = w.toUpperCase();
    btn.className = "word-btn";
    btn.onclick = () => handleWordClick(btn, w);
    wordGrid.appendChild(btn);
  });
}

// Obsługuje kliknięcie w słowo
function handleWordClick(button, word) {
  if(probyPozostale <= 0 || button.disabled) return;

  const guessedWord = word.toUpperCase();
  if(guessedWord === haslo) {
    // Zgadnięto hasło
    odkryteLitery = odkryteLitery.map(() => true);
    wypiszTerminal(buildDisplayText() + "\n\nWŁAMANIE POWODZENIE! HASŁO: " + haslo);
    disableAllButtons();
    return;
  }

  // Sprawdź ile liter zgadza się na swoich miejscach (jak w Fallout)
  let correctLetters = 0;
  for(let i = 0; i < haslo.length; i++) {
    if(haslo[i] === guessedWord[i]) {
      odkryteLitery[i] = true; // ujawnij te litery
      correctLetters++;
    }
  }

  probyPozostale--;
  wypiszTerminal(buildDisplayText() + `\n\nBŁĘDNE HASŁO! Trafione litery: ${correctLetters}`);

  button.disabled = true;

  updateAttempts();

  if(probyPozostale <= 0) {
    wypiszTerminal(buildDisplayText() + "\n\nBRAK PRÓB! HASŁO TO: " + haslo);
    disableAllButtons();
  }
}

function updateAttempts() {
  // Już aktualizujemy w buildDisplayText, ale można tu rozbudować (np. dźwięk)
}

function disableAllButtons() {
  const buttons = wordGrid.querySelectorAll
