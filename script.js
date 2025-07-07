const maxAttempts = 5;
let attemptsLeft = maxAttempts;
let secretWord = "";
const attemptsDiv = document.getElementById("attempts");
const wordsListDiv = document.getElementById("words-list");
const messageDiv = document.getElementById("message");

// Losuje słowo jako hasło
function losujHaslo() {
  const index = Math.floor(Math.random() * words6.length);
  return words6[index];
}

// Oblicza ile liter się zgadza na tych samych pozycjach
function porownajSlowa(a, b) {
  let count = 0;
  for(let i = 0; i < a.length; i++) {
    if(a[i] === b[i]) count++;
  }
  return count;
}

// Rysuje listę słów
function wyswietlSlowa() {
  wordsListDiv.innerHTML = "";
  words6.forEach(word => {
    const span = document.createElement("span");
    span.textContent = word;
    span.classList.add("word");
    span.addEventListener("click", () => kliknijSlowo(word));
    wordsListDiv.appendChild(span);
  });
}

// Obsługuje kliknięcie słowa
function kliknijSlowo(word) {
  if(attemptsLeft <= 0) return;
  if(messageDiv.textContent.includes("KONIEC GRY")) return;

  const matches = porownajSlowa(word, secretWord);

  attemptsLeft--;
  attemptsDiv.textContent = `Próby: ${attemptsLeft}`;

  if(word === secretWord) {
    messageDiv.textContent = `UDAŁO SIĘ! Hasło to: ${secretWord}`;
    blokujSlowa();
  } else {
    messageDiv.textContent = `Trafione liter: ${matches} z ${secretWord.length}`;
    if(attemptsLeft === 0) {
      messageDiv.textContent = `KONIEC GRY! Prawidłowe hasło to: ${secretWord}`;
      blokujSlowa();
    }
  }
}

// Blokuje kliknięcie słów po zakończeniu gry
function blokujSlowa() {
  const spans = document.querySelectorAll(".word");
  spans.forEach(span => span.style.pointerEvents = "none");
}

// Start gry
function start() {
  secretWord = losujHaslo();
  attemptsLeft = maxAttempts;
  attemptsDiv.textContent = `Próby: ${attemptsLeft}`;
  messageDiv.textContent = "";
  wyswietlSlowa();
}

start();
