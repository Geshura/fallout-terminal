// ----- ZMIENNE GLOBALNE -----
const terminal = document.getElementById("terminal");
const inputWrapper = document.getElementById("input-wrapper");
const difficultyCheckboxes = document.querySelectorAll('input[name="difficulty"]');

let password = "";
let attemptsLeft = 0;
let gameActive = false;
let wordsOnBoard = [];
const wordsCount = 10; // ile słów wyświetlamy na planszy

const difficultySettings = {
  easy: {
    lengths: [4, 5],
    attempts: 5
  },
  medium: {
    lengths: [6, 7],
    attempts: 7
  },
  hard: {
    lengths: [8, 9],
    attempts: 9
  }
};

// --- Funkcje pomocnicze ---

// Oblicza Likeness: ile liter jest na właściwej pozycji w obu słowach
function likeness(word1, word2) {
  let count = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === word2[i]) count++;
  }
  return count;
}

// Losuje n słów z tablicy bez powtórzeń
function getRandomWords(arr, n) {
  const result = [];
  const copy = [...arr];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

// Generuje planszę słów
function generateBoard(wordsList, password) {
  wordsOnBoard = getRandomWords(wordsList, wordsCount);

  // Jeśli hasło nie ma wylosowanego na planszy, dodaj je losowo
  if (!wordsOnBoard.includes(password)) {
    wordsOnBoard[Math.floor(Math.random() * wordsOnBoard.length)] = password;
  }
}

// Renderuje planszę w terminalu wraz z próbami i polem input
function render() {
  let text = `PRÓBY POZOSTAŁE: ${attemptsLeft}\n\n`;
  text += "Wybierz słowo i wpisz je, aby się włamać:\n\n";

  wordsOnBoard.forEach(word => {
    text += word + "\n";
  });

  terminal.textContent = text;
  inputWrapper.innerHTML = "";

  if (gameActive) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = password.length;
    input.autocomplete = "off";
    input.autofocus = true;
    inputWrapper.appendChild(input);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const guess = input.value.toUpperCase().trim();
        input.value = "";

        if (guess.length !== password.length) {
          alert(`Słowo musi mieć dokładnie ${password.length} liter.`);
          return;
        }
        if (!wordsOnBoard.includes(guess)) {
          alert("To słowo nie znajduje się na planszy.");
          return;
        }

        handleGuess(guess);
      }
    });
  }
}

// Obsługuje próbę zgadnięcia hasła
function handleGuess(guess) {
  if (!gameActive) return;

  if (guess === password) {
    terminal.textContent += `\n\nDOSTĘP PRZYZNANY. Hasło: ${password}`;
    gameActive = false;
    inputWrapper.innerHTML = "";
    return;
  }

  const likenessCount = likeness(guess, password);
  attemptsLeft--;

  terminal.textContent += `\n\n${guess} - LIKENESS: ${likenessCount}`;
  if (attemptsLeft <= 0) {
    terminal.textContent += `\n\nBRAK PRÓB! Hasło to: ${password}`;
    gameActive = false;
    inputWrapper.innerHTML = "";
  }

  render();
}

// Ustawia poziom trudności i startuje grę
function startGame(difficulty) {
  if (!difficultySettings[difficulty]) return;

  const lengths = difficultySettings[difficulty].lengths;
  attemptsLeft = difficultySettings[difficulty].attempts;

  const chosenLength = lengths[Math.floor(Math.random() * lengths.length)];
  const wordsList = window[`words${chosenLength}`];

  if (!wordsList || wordsList.length < wordsCount) {
    alert(`Brak wystarczającej liczby słów o długości ${chosenLength}`);
    return;
  }

  password = wordsList[Math.floor(Math.random() * wordsList.length)].toUpperCase();
  generateBoard(wordsList, password);
  gameActive = true;

  render();
}

// Obsługa checkboxów - tylko jeden może być aktywny
difficultyCheckboxes.forEach(chk => {
  chk.addEventListener('change', () => {
    if (chk.checked) {
      difficultyCheckboxes.forEach(c => { if (c !== chk) c.checked = false; });
      startGame(chk.value);
    } else {
      // Gdy checkbox odznaczony - reset gry
      terminal.textContent = "Wybierz poziom trudności, aby rozpocząć...";
      inputWrapper.innerHTML = "";
      gameActive = false;
      password = "";
      attemptsLeft = 0;
    }
  });
});
