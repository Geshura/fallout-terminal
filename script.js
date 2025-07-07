const terminal = document.getElementById("terminal");
const attemptsDiv = document.getElementById("attempts");
const messageDiv = document.getElementById("message");

const rows = 16;    // liczba wierszy terminala
const cols = 12;    // znaków w wierszu
const maxAttempts = 5;
let attemptsLeft = maxAttempts;
let secretWord = "";
let placedWords = [];  // pozycje i słowa w terminalu

const fillerChars = "{}[]()<>\\/|!@#$%^&*-+=~";

// Funkcja losuje słowo jako hasło
function losujHaslo() {
  return words6[Math.floor(Math.random() * words6.length)];
}

// Funkcja sprawdza ile liter pasuje na pozycji
function liczDopasowania(slowo1, slowo2) {
  let count = 0;
  for(let i=0; i<slowo1.length; i++) {
    if(slowo1[i] === slowo2[i]) count++;
  }
  return count;
}

// Generuje pustą planszę i ukrywa słowa
function generujPlansze() {
  // Inicjuj planszę wypełnioną wypełniaczami
  let board = [];
  for(let r=0; r<rows; r++) {
    let row = "";
    for(let c=0; c<cols; c++) {
      row += fillerChars[Math.floor(Math.random()*fillerChars.length)];
    }
    board.push(row.split(''));
  }

  placedWords = [];

  // Losujemy 5 słów do planszy i układamy je poziomo w losowych wierszach i pozycjach
  let wordsToPlace = [];
  while(wordsToPlace.length < 5) {
    let w = words6[Math.floor(Math.random()*words6.length)];
    if(!wordsToPlace.includes(w)) wordsToPlace.push(w);
  }

  secretWord = wordsToPlace[Math.floor(Math.random()*wordsToPlace.length)];

  wordsToPlace.forEach(word => {
    let row, col;
    let attempts = 0;
    do {
      row = Math.floor(Math.random() * rows);
      col = Math.floor(Math.random() * (cols - word.length));
      attempts++;
      if(attempts > 100) break; // bezpieczeństwo
    } while(!canPlaceWord(board, word, row, col));
    placeWord(board, word, row, col);
    placedWords.push({ word, row, col });
  });

  return board;
}

function canPlaceWord(board, word, row, col) {
  for(let i=0; i<word.length; i++) {
    if(board[row][col+i] !== fillerChars[0] && board[row][col+i] !== undefined) {
      // Pozwól nadpisać tylko jeśli jest fillerChar (czyli wypełniacz)
      if(fillerChars.indexOf(board[row][col+i]) === -1) {
        return false;
      }
    }
  }
  return true;
}

function placeWord(board, word, row, col) {
  for(let i=0; i<word.length; i++) {
    board[row][col+i] = word[i];
  }
}

// Renderuje planszę i ustawia event kliknięcia
function renderPlansza(board) {
  terminal.innerHTML = "";

  for(let r=0; r<rows; r++) {
    let line = document.createElement("div");
    line.style.userSelect = "none";
    line.style.whiteSpace = "pre";

    for(let c=0; c<cols; c++) {
      let span = document.createElement("span");
      span.textContent = board[r][c];
      span.style.cursor = "default";

      // Sprawdzamy, czy znak jest częścią słowa
      const wordAtPos = placedWords.find(({ word, row, col }) => {
        return r === row && c >= col && c < col + word.length;
      });

      if(wordAtPos && c >= wordAtPos.col && c < wordAtPos.col + wordAtPos.word.length) {
        // Jeśli to pierwsza litera słowa, ustaw na kliknięcie całego słowa
        if(c === wordAtPos.col) {
          span.style.color = "#00ff00";
          span.style.cursor = "pointer";
          span.style.textDecoration = "underline";

          span.addEventListener("click", () => {
            kliknijSlowo(wordAtPos.word);
          });
          // Dodaj tooltip - wskazówka
          span.title = "Kliknij aby wybrać słowo";
          span.textContent = wordAtPos.word;
          // Ukrywamy resztę liter słowa - są w jednym elemencie (zastępujemy litery pojedynczym spanem)
          // Przeskocz pozostałe litery, bo wyświetliliśmy całe słowo naraz
          c += wordAtPos.word.length - 1;
        }
      } else {
        span.style.color = "#006600"; // ciemniejszy wypełniacz
      }

      line.appendChild(span);
    }
    terminal.appendChild(line);
  }
}

// Obsługa kliknięcia słowa
function kliknijSlowo(word) {
  if(attemptsLeft <= 0) return;
  if(messageDiv.textContent.includes("KONIEC GRY")) return;

  const matches = liczDopasowania(word, secretWord);
  attemptsLeft--;
  attemptsDiv.textContent = `Próby: ${attemptsLeft}`;

  if(word === secretWord) {
    messageDiv.textContent = `>>> UDAŁO SIĘ! Hasło to: ${secretWord} <<<`;
    koniecGry(true);
  } else {
    messageDiv.textContent = `Trafione litery: ${matches} z ${secretWord.length}`;
    if(attemptsLeft === 0) {
      messageDiv.textContent = `>>> KONIEC GRY! Hasło to: ${secretWord} <<<`;
      koniecGry(false);
    }
  }
}

function koniecGry(wygrana) {
  // Zablokuj kliknięcia - usuwamy eventy kliknięcia z terminala
  const spans = terminal.querySelectorAll("span");
  spans.forEach(span => {
    span.style.pointerEvents = "none";
  });
}

function start() {
  attemptsLeft = maxAttempts;
  attemptsDiv.textContent = `Próby: ${attemptsLeft}`;
  messageDiv.textContent = "";
  const board = generujPlansze();
  renderPlansza(board);
}

start();
