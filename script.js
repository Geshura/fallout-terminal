const wordListEl = document.getElementById("word-list");
const statusEl = document.getElementById("status");
const terminalEl = document.getElementById("terminal");

let haslo = "";
let probyPozostale = 5;

function startGame() {
  haslo = words6[Math.floor(Math.random() * words6.length)].toUpperCase();
  probyPozostale = 5;
  statusEl.textContent = "";
  
  // Wyświetl aktualne próby
  updateAttempts();

  // Wyczyść listę i wygeneruj nowe słowa jako przyciski
  wordListEl.innerHTML = "";
  words6.forEach(w => {
    const btn = document.createElement("button");
    btn.textContent = w.toUpperCase();
    btn.classList.add("word-btn");
    btn.addEventListener("click", () => kliknietoSlowo(btn, w));
    wordListEl.appendChild(btn);
  });
}

function kliknietoSlowo(button, slowo) {
  if(probyPozostale <= 0 || button.disabled) return;

  if(slowo.toUpperCase() === haslo) {
    statusEl.textContent = `>> ${haslo} - POPRAWNE HASŁO! WŁAMANIE POWODZENIE. <<`;
    disableButtons();
  } else {
    probyPozostale--;
    statusEl.textContent = `>> ${slowo.toUpperCase()} - BŁĘDNE HASŁO. SPRÓBUJ PONOWNIE. <<`;
    button.disabled = true;
    updateAttempts();
    if(probyPozostale === 0) {
      statusEl.textContent = `>> BRAK PRÓB! HASŁO TO: ${haslo} <<`;
      disableButtons();
    }
  }
}

function updateAttempts() {
  terminalEl.textContent = `Wybierz słowo, aby włamać się do systemu:\n\nPRÓBY POZOSTAŁE: ${probyPozostale}\n`;
}

function disableButtons() {
  const buttons = wordListEl.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);
}

// Startujemy grę po załadowaniu
startGame();
