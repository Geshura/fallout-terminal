// ----- ZMIENNE GLOBALNE -----

let haslo = "";
let probyPozostale = 0;
let zablokowany = true;

const terminal = document.getElementById("terminal");
const inputWrapper = document.getElementById("input-wrapper");
const difficultyCheckboxes = document.querySelectorAll('input[name="difficulty"]');

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

// ----- FUNKCJE -----

// Czyści terminal i usuwa input
function wyczyscTerminal() {
  terminal.textContent = "";
  inputWrapper.innerHTML = "";
}

// Buduje planszę pamięci (tu bardzo uproszczona, do rozbudowy)
function budujPamiec(word, attempts) {
  // Pokazuje ile liter w haśle i ile prób pozostało
  return `HASŁO: ${"_ ".repeat(word.length).trim()}\n\nPRÓB: ${attempts}`;
}

// Tworzy input do wpisywania liter
function stworzInput() {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 1;
  input.autocomplete = "off";
  input.autofocus = true;
  input.style.fontSize = "1.2rem";
  input.style.padding = "5px";
  inputWrapper.appendChild(input);

  input.addEventListener("input", (e) => {
    const litera = e.target.value.toUpperCase();
    e.target.value = ""; // Czyści pole po wpisaniu

    if(zablokowany || !litera.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/i)) return;

    sprawdzLitere(litera);
  });
}

// Sprawdza czy litera jest w haśle
function sprawdzLitere(litera) {
  if(!haslo.includes(litera)) {
    probyPozostale--;
  }

  // TODO: rozbudować wyświetlanie planszy z ujawnionymi literami
  terminal.textContent = budujPamiec(haslo, probyPozostale);

  if(probyPozostale <= 0) {
    terminal.textContent += `\n\nKONIEC GRY! Hasło to: ${haslo}`;
    zablokowany = true;
    inputWrapper.innerHTML = "";
  }
}

// Ustawia poziom trudności i generuje planszę
function ustawPoziom(difficulty) {
  if(!difficultySettings[difficulty]) return;

  const lengths = difficultySettings[difficulty].lengths;
  const proby = difficultySettings[difficulty].attempts;

  // Losujemy długość słowa z dostępnych na poziomie
  const chosenLength = lengths[Math.floor(Math.random()*lengths.length)];

  // Pobieramy odpowiednią tablicę słów globalnie (np. words4)
  const listaSlow = window[`words${chosenLength}`];
  if(!listaSlow || listaSlow.length === 0) {
    alert(`Brak słów o długości ${chosenLength}`);
    return;
  }

  haslo = listaSlow[Math.floor(Math.random()*listaSlow.length)].toUpperCase();
  probyPozostale = proby;
  zablokowany = false;

  wyczyscTerminal();
  terminal.textContent = budujPamiec(haslo, probyPozostale);
  stworzInput();
}

// Obsługa wyboru checkboxów (tylko jeden na raz)
difficultyCheckboxes.forEach(chk => {
  chk.addEventListener('change', () => {
    if(chk.checked) {
      difficultyCheckboxes.forEach(c => { if(c !== chk) c.checked = false; });
      ustawPoziom(chk.value);
    } else {
      wyczyscTerminal();
      haslo = "";
      probyPozostale = 0;
      zablokowany = true;
      inputWrapper.innerHTML = "";
    }
  });
});

// --- INICJALIZACJA ---
// Opcjonalnie ustaw poziom domyślny na łatwy
// difficultyCheckboxes[0].checked = true;
// ustawPoziom("easy");
