const wordListEl = document.getElementById("word-list");
const statusEl = document.getElementById("status");
const attemptsEl = document.getElementById("attempts");

let haslo = "";
let probyPozostale = 5;

function startGame() {
  // Losujemy hasło
  haslo = words6[Math.floor(Math.random() * words6.length)].toUpperCase();
  probyPozostale = 5;
  statusEl.textContent = "Kliknij słowo, aby odgadnąć hasło";
  attemptsEl.textContent = `Próby pozostałe: ${probyPozostale}`;

  // Generujemy listę słów
  wordListEl.innerHTML = "";
  words6.forEach(w => {
    const btn = document.createElement("button");
    btn.textContent = w.toUpperCase();
    btn.className = "word-btn";
    btn.addEventListener("click", () => {
      if (probyPozostale <= 0) return;
      if (btn.disabled) return;

      if (w.toUpperCase() === haslo) {
        statusEl.textContent = `Gratulacje! Odgadłeś hasło: ${haslo}`;
        disableButtons();
      } else {
        probyPozostale--;
        attemptsEl.textContent = `Próby pozostałe: ${probyPozostale}`;
        btn.disabled = true;

        if (probyPozostale === 0) {
          statusEl.textContent = `Koniec gry! Hasło to: ${haslo}`;
          disableButtons();
        } else {
          statusEl.textContent = `Błędne słowo, spróbuj ponownie`;
        }
      }
    });
    wordListEl.appendChild(btn);
  });
}

function disableButtons() {
  const buttons = wordListEl.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);
}

// Start gry po załadowaniu
startGame();
